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

        // CAMBIAR: usar in_stock o stock.quantity
        const stockQuantity = product.attributes?.in_stock || product.attributes?.stock?.quantity || 0;

        if (stockQuantity > 0.0) {
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
        console.log('Adding product to cart:', product);

        const existingCart = [...updateProducts];
        const productInCart = existingCart.find(
            item => item.id === product.id && (!item.item_type || item.item_type === 'product')
        );

        if (productInCart) {
            productInCart.quantity = (productInCart.quantity || 1) + 1;
        } else {
            // ESTRUCTURA CORREGIDA basada en tu JSON:
            const preparedProduct = {
                id: product.id,
                item_type: 'product',
                name: product.attributes?.name || 'Producto sin nombre',
                code: product.attributes?.code || product.attributes?.product_code || '',
                product_code: product.attributes?.product_code || product.attributes?.code || '',

                // PRECIOS - usando los campos correctos del JSON
                product_price: Number(product.attributes?.product_price || 0),
                product_cost: Number(product.attributes?.product_cost || 0),
                price: Number(product.attributes?.product_price || 0), // Campo alternativo

                // UNIDADES - usando los campos correctos del JSON
                product_unit: product.attributes?.product_unit || '1',
                sale_unit: product.attributes?.sale_unit || '1',
                purchase_unit: product.attributes?.purchase_unit || '1',

                // STOCK
                stock_alert: Number(product.attributes?.stock_alert || 0),
                quantity_limit: Number(product.attributes?.quantity_limit || 0),
                in_stock: Number(product.attributes?.in_stock || product.attributes?.stock?.quantity || 0),

                // CANTIDAD INICIAL
                quantity: 1,

                // IMPUESTOS
                order_tax: product.attributes?.order_tax || null,
                tax_type: product.attributes?.tax_type || '1',

                // CATEGORÍA Y MARCA
                product_category_id: product.attributes?.product_category_id,
                brand_id: product.attributes?.brand_id,
                product_category_name: product.attributes?.product_category_name || '',
                brand_name: product.attributes?.brand_name || '',

                // INFORMACIÓN ADICIONAL
                notes: product.attributes?.notes || '',
                expiry_date: product.attributes?.expiry_date || null,

                // UNIDADES CON NOMBRES (del JSON)
                product_unit_name: product.attributes?.product_unit_name,
                sale_unit_name: product.attributes?.sale_unit_name,
                purchase_unit_name: product.attributes?.purchase_unit_name,

                // STOCK POR ALMACÉN
                stock: product.attributes?.stock,
                warehouse: product.attributes?.warehouse,

                // CÓDIGO DE BARRAS
                barcode_url: product.attributes?.barcode_url || '',
                barcode_symbol: product.attributes?.barcode_symbol || 1,

                // IMAGEN - CORREGIR la referencia
                image: product.attributes?.images?.imageUrls?.[0] || productImage,
                images: product.attributes?.images || null,

                // ALMACÉN SELECCIONADO
                warehouse_id: selectedOption?.value,

                // MANTENER REFERENCIA COMPLETA
                attributes: product.attributes,
            };

            existingCart.push(preparedProduct);
        }
        setUpdateProducts(existingCart);
        // IMPORTANTE: Actualizar el carrito en el componente padre
        updateCart(existingCart);
        console.log('Cart updated with product:', existingCart);
    };


    const isProductExistInCart = (productId) => {
        return cartProductIds.includes(productId);
    };

    const posFilterProduct = posAllProducts &&
        settings?.attributes?.show_pos_stock_product === 'true'
        ? posAllProducts :
        posAllProducts.filter(
            (product) => {
                const stockQuantity = product?.attributes?.in_stock || product?.attributes?.stock?.quantity || 0;
                return stockQuantity > 0.0;
            }
        );

    //Cart Item Array
    const loadAllProduct = (product, index) => {
        const stockQuantity = product.attributes?.in_stock || product.attributes?.stock?.quantity || 0;

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
                            product.attributes?.images?.imageUrls?.[0] || productImage
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
                                {product.attributes?.code || product.attributes?.product_code}
                            </span>
                            {product.attributes?.variation_product ?
                                <span className="badge bg-light-info fs-small text-gray-700">
                                    {product.attributes?.variation_product?.variation_type_name}
                                </span> : ''}
                        </div>
                        <p className="m-0 item-badges">
                            <Badge
                                bg="info"
                                text="white"
                                className="product-custom-card__card-badge"
                            >
                                {stockQuantity}{" "}
                                {product?.attributes?.product_unit_name?.name ||
                                    product?.attributes?.sale_unit_name?.name ||
                                    product?.attributes?.purchase_unit_name?.name}
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
                                        : product.attributes?.product_price
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
