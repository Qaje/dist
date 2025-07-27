import React, { useEffect, useRef, useState } from "react";
import { Card, Badge } from "react-bootstrap-v5";
import { connect, useDispatch } from "react-redux";
import { posAllAssistance } from "../../../store/action/pos/posAllAssistanceAction";
import assistanceImage from "../../../assets/images/assistance_default.png";
import { addToast } from "../../../store/action/toastAction";
import {
    currencySymbolHandling,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
import { toastType } from "../../../constants";
import Skelten from "../../../shared/components/loaders/Skelten";

const Assistance = (props) => {
    const {
        posAllAssistances,
        cartProducts,
        updateCart,
        customCart,
        cartAssistanceIds,
        setCartAssistanceIds,
        settings,
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
        // update cart while cart is updated
        cartProducts && setUpdateProducts(cartProducts);
        const ids = updateProducts
            .filter(item => item.item_type === 'assistance')
            .map((item) => item.id);
        setCartAssistanceIds(ids);
    }, [updateProducts, cartProducts]);

    const addToCart = (assistance) => {
        if (settings?.attributes?.enable_pos_click_audio === 'true' && clickAudioRef.current) {
            clickAudioRef.current.play().catch((e) => {
                console.warn("Audio play failed:", e);
            });
        }
        addAssistanceToCart(assistance);
    };

    const handleScroll = () => {
        if (loadingMore) return;

        const scrollableDiv = document.querySelector(".assistance-list-block");
        if (scrollableDiv) {
            const { scrollTop, scrollHeight, clientHeight } = scrollableDiv;

            if (scrollTop + clientHeight >= scrollHeight - 20) {
                if (posAllAssistances.length < totalRecord) {
                    setLoadingMore(true);
                    onScrollCallAPI(page + 1);
                    setPage((prevPage) => prevPage + 1);
                }
            }
        }
    };

    const handleLoadMoreClick = () => {
        if (!loadingMore && posAllAssistances.length < totalRecord) {
            setLoadingMore(true);
            onScrollCallAPI(page + 1);
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        const scrollableDiv = document.querySelector(".assistance-list-block");
        if (scrollableDiv) {
            scrollableDiv.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollableDiv) {
                scrollableDiv.removeEventListener("scroll", handleScroll);
            }
        };
    }, [page, loadingMore, posAllAssistances, totalRecord]);

    useEffect(() => {
        setLoadingMore(false);
    }, [posAllAssistances]);

    const addAssistanceToCart = (assistance) => {
        const filterQty = updateProducts
            .filter((item) => item.id === assistance.id && item.item_type === 'assistance')
            .map((qty) => qty.quantity)[0];

        if (updateProducts.filter((item) => item.id === assistance.id && item.item_type === 'assistance').length > 0) {
            // Increase quantity if already in cart
            setUpdateProducts((updateProducts) =>
                updateProducts.map((item) =>
                    item.id === assistance.id && item.item_type === 'assistance'
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                        : item
                )
            );
            updateCart(updateProducts.map((item) =>
                item.id === assistance.id && item.item_type === 'assistance'
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            // Add new assistance to cart
            const newAssistance = {
                ...assistance,
                warehouse_id: selectedOption.value,
                item_type: 'assistance',
                quantity: 1,
                image: assistance.attributes.image_url || assistanceImage
            };

            setUpdateProducts((prevSelected) => [...prevSelected, newAssistance]);
            updateCart((prevSelected) => [...prevSelected, newAssistance]);
        }
    };

    const isAssistanceExistInCart = (assistanceId) => {
        return cartAssistanceIds.includes(assistanceId);
    };

    const loadAllAssistance = (assistance, index) => {
        return (
            <div
                className="assistance-custom-card"
                key={index}
                onClick={() => addToCart(assistance)}
            >
                <Card
                    className={`position-relative h-100 ${
                        isAssistanceExistInCart(assistance.id) ? "assistance-active" : ""
                    }`}
                >
                    <Card.Img
                        variant="top"
                        src={
                            assistance.attributes.image_url || assistanceImage
                        }
                    />
                    <Card.Body className="px-2 pt-2 pb-1 custom-card-body d-flex flex-column justify-content-evenly">
                        <h6 className="assistance-title mb-0 text-gray-900">
                            {assistance.attributes?.name}
                            {assistance.attributes?.code && (
                                ` (${assistance.attributes?.code})`
                            )}
                        </h6>
                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <span className="fs-small text-gray-700 me-2">
                                {assistance.attributes.assistance_type || 'Service'}
                            </span>
                            <span className="badge bg-light-success fs-small text-gray-700">
                                {getFormattedMessage("assistance.available.label")}
                            </span>
                        </div>
                        <p className="m-0 item-badges">
                            <Badge
                                bg="info"
                                text="white"
                                className="assistance-custom-card__card-badge"
                            >
                                {assistance.attributes.duration || '1'} {assistance.attributes.duration_unit || 'Hour'}
                            </Badge>
                        </p>
                        <p className="m-0 item-badge">
                            <Badge
                                bg="primary"
                                text="white"
                                className="assistance-custom-card__card-badge"
                            >
                                {currencySymbolHandling(
                                    allConfigData,
                                    settings.attributes &&
                                    settings.attributes.currency_symbol,
                                    assistance.attributes.price
                                )}
                            </Badge>
                        </p>
                    </Card.Body>
                </Card>
            </div>
        );
    };

    return (
        <div
            className={`${
                posAllAssistances && posAllAssistances.length === 0
                    ? "d-flex align-items-center justify-content-center"
                    : ""
            } assistance-list-block pt-1`}
        >
            <audio ref={clickAudioRef} src={settings?.attributes?.click_audio} preload="auto" />
            <div className="d-flex flex-wrap assistance-list-block__assistance-block w-100">
                {posAllAssistances && posAllAssistances.length === 0 ? (
                    isLoading ? (
                        <Skelten />
                    ) : (
                        <h4 className="m-auto">
                            {getFormattedMessage(
                                "pos-no-assistance-available.label"
                            )}
                        </h4>
                    )
                ) : (
                    posAllAssistances &&
                    posAllAssistances.map((assistance, index) => {
                        return loadAllAssistance(assistance, index);
                    })
                )}

                {posAllAssistances.length < totalRecord && !isLoading && (
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
    const { posAllAssistances, allConfigData, isLoading, totalRecord } = state;
    return { posAllAssistances, allConfigData, isLoading, totalRecord };
};

export default connect(mapStateToProps, { posAllAssistance })(
    Assistance
);
