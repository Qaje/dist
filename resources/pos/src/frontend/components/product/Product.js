import React, { useEffect, useRef, useState } from "react";
import { Card, Badge } from "react-bootstrap-v5";
import { connect, useDispatch } from "react-redux";
import { posFetchProduct } from "../../../store/action/pos/posfetchProductAction";
import { posAllProduct } from "../../../store/action/pos/posAllProductAction";
import productImage from "../../../assets/images/brand_logo.png";
import { addToast } from "../../../store/action/toastAction";
import {
    currencySymbolHandling,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
import { calculateProductCost } from "../../shared/SharedMethod"; // Agregar esta importación
import { toastType } from "../../../constants";
import Skelten from "../../../shared/components/loaders/Skelten";

const Product = (props) => {
    const {
        posAllProducts,
        cartProducts,
        updateCart,
        customCart,
        cartProductIds,
        setCartProductIds,
        settings,
        productMsg,
        newCost,
        selectedOption,
        allConfigData,
        isLoading,
        totalRecord,
        onScrollCallAPI,
        page,
        setPage,
    } = props;
    const [updateProducts, setUpdateProducts] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const clickAudioRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('📊 Cart products updated:', cartProducts);
        // update cart while cart is updated
        if (cartProducts) {
            setUpdateProducts(cartProducts);
            const ids = cartProducts.map((item) => {
                return item.id;
            });
            setCartProductIds(ids);
        }
    }, [cartProducts]);

    const addToCart = (product) => {
        console.log('🔄 addToCart called with:', product);

        if (product.attributes.stock.quantity > 0.0) {
            if (settings?.attributes?.enable_pos_click_audio === 'true' && clickAudioRef.current) {
                clickAudioRef.current.play().catch((e) => {
                    console.warn("Audio play failed:", e);
                });
            }
            addProductToCart(product);
        } else {
            console.log('❌ Product out of stock');
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "pos.quantity.exceeds.quantity.available.in.stock.message"
                    ),
                    type: toastType.ERROR,
                })
            );
        }
    };

    const handleScroll = () => {
        if (loadingMore) return; // Prevent multiple API calls

        const scrollableDiv = document.querySelector(".product-list-block");
        if (scrollableDiv) {
            const { scrollTop, scrollHeight, clientHeight } = scrollableDiv;

            if (scrollTop + clientHeight >= scrollHeight - 20) {
                // User reached near bottom
                if (posAllProducts.length < totalRecord) {
                    setLoadingMore(true);
                    onScrollCallAPI(page + 1); // Call API with next page
                    setPage((prevPage) => prevPage + 1);
                }
            }
        }
    };

    const handleLoadMoreClick = () => {
        if (!loadingMore && posAllProducts.length < totalRecord) {
            setLoadingMore(true);
            onScrollCallAPI(page + 1);
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        const scrollableDiv = document.querySelector(".product-list-block");
        if (scrollableDiv) {
            scrollableDiv.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollableDiv) {
                scrollableDiv.removeEventListener("scroll", handleScroll);
            }
        };
    }, [page, loadingMore, posAllProducts, totalRecord]); // Run effect when page or loading state changes

    useEffect(() => {
        setLoadingMore(false);
    }, [posAllProducts]);

    // Efecto separado para actualizar los IDs cuando updateProducts cambie
    useEffect(() => {
        const ids = updateProducts.map((item) => {
            return item.id;
        });
        setCartProductIds(ids);
        console.log('🆔 Updated cart product IDs:', ids);
    }, [updateProducts]);

    const addProductToCart = (product) => {
        console.log('🛒 Adding product to cart:', product);

        const existingCart = [...updateProducts];
        const productInCart = existingCart.find(
            item => item.id === product.id && (item.item_type !== 'assistance')
        );

        if (productInCart) {
            console.log('✅ Product exists in cart, incrementing quantity');
            productInCart.quantity = (productInCart.quantity || 1) + 1;
        } else {
            console.log('🆕 Adding new product to cart');
            const productPrice = product.attributes?.product_price ||
                product.product_price ||
                product.attributes?.price ||
                product.price ||
                calculateProductCost(product) ||
                0;

            const preparedProduct = {
                ...product,
                item_type: 'product',
                quantity: 1,
                product_price: productPrice,
                price: productPrice,
                // Asegurar que tenga nombre para mostrar en el carrito
                name: product.attributes?.name || product.name || 'Producto sin nombre'
            };

            console.log('📦 Prepared product:', preparedProduct);
            existingCart.push(preparedProduct);
        }

        console.log('🛍️ Updated cart:', existingCart);
        setUpdateProducts(existingCart);

        // Llamar a updateCart del padre para asegurar que se actualice
        if (updateCart) {
            updateCart(existingCart);
        }
    };

    const isProductExistInCart = (productId) => {
        return cartProductIds.includes(productId);
    };

    const posFilterProduct = posAllProducts &&
        settings?.attributes?.show_pos_stock_product === 'true'
        ? posAllProducts :
        posAllProducts.filter(
            (product) => product?.attributes?.stock?.quantity > 0.0
        );

    //Cart Item Array
    const loadAllProduct = (product, index) => {

        return (
            <div
                className="product-custom-card"
                key={index}
                onClick={() => addToCart(product)}
            >
                <Card
                    className={`position-relative h-100 ${isProductExistInCart(product.id) ? "product-active" : ""
                        }`}
                >
                    <Card.Img
                        variant="top"
                        src={
                            product.attributes.images.imageUrls
                                ? product.attributes.images.imageUrls[0]
                                : productImage
                        }
                    />
                    <Card.Body className="px-2 pt-2 pb-1 custom-card-body d-flex flex-column justify-content-evenly">
                        <h6 className="product-title mb-0 text-gray-900">
                            {product.attributes?.name}
                            {product.attributes?.code !==
                                product.attributes?.product_code
                                ? ` (${product.attributes?.product_code})`
                                : null}
                        </h6>
                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <span className="fs-small text-gray-700 me-2">
                                {product.attributes.code}
                            </span>
                            {product.attributes?.variation_product ? <span className="badge bg-light-info fs-small text-gray-700">
                                {product.attributes?.variation_product?.variation_type_name}
                            </span> : ''}
                        </div>
                        <p className="m-0 item-badges">
                            <Badge
                                bg="info"
                                text="white"
                                className="product-custom-card__card-badge"
                            >
                                {product.attributes.stock &&
                                    product.attributes.stock.quantity}{" "}
                                {product?.attributes?.product_unit_name?.name}
                            </Badge>
                        </p>
                        <p className="m-0 item-badge">
                            <Badge
                                bg="primary"
                                text="white"
                                className="product-custom-card__card-badge"
                            >
                                {currencySymbolHandling(
                                    allConfigData,
                                    settings.attributes &&
                                    settings.attributes.currency_symbol,
                                    newCost
                                        ? newCost
                                        : product.attributes.product_price
                                )}
                            </Badge>
                        </p>
                    </Card.Body>
                </Card>
            </div>
        )
    };

    return (
        <div
            className={`${posFilterProduct && posFilterProduct.length === 0
                ? "d-flex align-items-center justify-content-center"
                : ""
                } product-list-block pt-1`}
        >
            <audio ref={clickAudioRef} src={settings?.attributes?.click_audio} preload="auto" />
            <div className="d-flex flex-wrap product-list-block__product-block w-100">
                {posFilterProduct && posFilterProduct.length === 0 ? (
                    isLoading ? (
                        <Skelten />
                    ) : (
                        <h4 className="m-auto">
                            {getFormattedMessage(
                                "pos-no-product-available.label"
                            )}
                        </h4>
                    )
                ) : (
                    ""
                )}
                {productMsg && productMsg === 1 ? (
                    <h4 className="m-auto">
                        {getFormattedMessage("pos-no-product-available.label")}
                    </h4>
                ) : (
                    posFilterProduct &&
                    posFilterProduct.map((product, index) => {
                        return loadAllProduct(product, index);
                    })
                )}

                {posAllProducts.length < totalRecord && !isLoading && (
                    <div className="d-flex justify-content-center w-100 my-3">
                        <button
                            className="btn btn-outline-primary"
                            onClick={handleLoadMoreClick}
                            disabled={loadingMore}
                        >
                            {loadingMore ? getFormattedMessage("loading.title") : getFormattedMessage("load.more.title")}
                        </button>
                    </div>
                )}

                {isLoading && (
                    <div className="d-flex justify-content-center w-100 text-primary">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const { posAllProducts, allConfigData, isLoading, totalRecord } = state;
    return { posAllProducts, allConfigData, isLoading, totalRecord };
};

export default connect(mapStateToProps, { posAllProduct, posFetchProduct })(
    Product
);
