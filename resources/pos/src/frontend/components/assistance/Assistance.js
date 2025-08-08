import React, { useEffect, useRef, useState } from "react";
import { Card, Badge } from "react-bootstrap-v5";
import { connect, useDispatch } from "react-redux";
import { addToast } from "../../../store/action/toastAction";
import {
    currencySymbolHandling,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
import { toastType } from "../../../constants";
import Skelten from "../../../shared/components/loaders/Skelten";

// Imagen por defecto para servicios
const defaultServiceImage = '/images/default-service-icon.png';

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
        addAssistanceToCart,
        isAssistanceInCart,
        incrementAssistanceInCart,
        decrementAssistanceInCart,
        getAssistanceQuantityInCart,
        frontSetting
    } = props;

    const [updateProducts, setUpdateProducts] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const clickAudioRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('📊 Cart assistances updated:', cartProducts);
        if (cartProducts) {
            setUpdateProducts(cartProducts);
            const ids = cartProducts
                .filter(item => item.item_type === 'assistance')
                .map((item) => item.id);
            setCartAssistanceIds(ids);
        }
    }, [cartProducts]);

    const addToCart = (assistance) => {
        console.log('🔄 addToCart called with assistance:', assistance);

        // Para asistencias no verificamos stock, siempre se pueden agregar
        if (settings?.attributes?.enable_pos_click_audio === 'true' && clickAudioRef.current) {
            clickAudioRef.current.play().catch((e) => {
                console.warn("Audio play failed:", e);
            });
        }
        addAssistanceToCartDirectly(assistance);
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

    useEffect(() => {
        const ids = updateProducts
            .filter(item => item.item_type === 'assistance')
            .map((item) => item.id);
        setCartAssistanceIds(ids);
        console.log('🆔 Updated cart assistance IDs:', ids);
    }, [updateProducts]);

    const addAssistanceToCartDirectly = (assistance) => {
        console.log('Adding assistance to cart:', assistance);

        const existingCart = [...updateProducts];
        const assistanceInCart = existingCart.find(
            item => item.id === assistance.id && item.item_type === 'assistance'
        );

        if (assistanceInCart) {
            assistanceInCart.quantity = (assistanceInCart.quantity || 1) + 1;
        } else {
            const assistancePrice = Number(assistance.attributes?.asistence_price || 0);

            const preparedAssistance = {
                id: assistance.id,
                item_type: 'assistance',
                name: assistance.attributes?.name || 'Servicio sin nombre',
                code: assistance.attributes?.code || '',
                // Precios
                asistence_price: assistancePrice,
                price: assistancePrice,
                cost: Number(assistance.attributes?.asistence_cost || 0),
                // Unidades y duración
                unit: assistance.attributes?.asistence_unit || '1',
                estimated_duration: Number(assistance.attributes?.estimated_duration || 0),
                quantity: 1,
                // Impuestos
                order_tax: Number(assistance.attributes?.order_tax || 0),
                tax_type: assistance.attributes?.tax_type || '1',
                // Información adicional
                description: assistance.attributes?.description || '',
                notes: assistance.attributes?.notes || '',
                category_id: assistance.attributes?.asistence_category_id,
                warehouse_id: selectedOption?.value,
                // Imagen
                image: assistance.attributes?.image_url || defaultServiceImage,
                attributes: assistance.attributes,
            };

            existingCart.push(preparedAssistance);
        }

        setUpdateProducts(existingCart);
        updateCart(existingCart);
        console.log('Cart updated with assistance:', existingCart);
    };

    const isAssistanceExistInCart = (assistanceId) => {
        return cartAssistanceIds.includes(assistanceId);
    };

    const formatDuration = (minutes) => {
        if (!minutes || minutes === 0) return '';

        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) {
            return `${hours}h`;
        }
        return `${hours}h ${remainingMinutes}m`;
    };

    // Filtrar asistencias activas
    const posFilterAssistance = posAllAssistances && Array.isArray(posAllAssistances)
        ? posAllAssistances.filter(assistance =>
            assistance.attributes?.is_active !== false &&
            assistance.attributes?.is_active !== 0
        )
        : [];

    const loadAllAssistance = (assistance, index) => {
        const duration = formatDuration(assistance.attributes?.estimated_duration);

        return (
            <div
                className="product-custom-card"
                key={index}
                onClick={() => addToCart(assistance)}
            >
                <Card
                    className={`position-relative h-100 ${isAssistanceExistInCart(assistance.id) ? "product-active" : ""
                        }`}
                >
                    <Card.Img
                        variant="top"
                        src={assistance.attributes?.image_url || defaultServiceImage}
                        onError={(e) => {
                            e.target.src = defaultServiceImage;
                        }}
                    />
                    <Card.Body className="px-2 pt-2 pb-1 custom-card-body d-flex flex-column justify-content-evenly">
                        <h6 className="product-title mb-0 text-gray-900">
                            {assistance.attributes?.name}
                            {assistance.attributes?.code && (
                                ` (${assistance.attributes.code})`
                            )}
                        </h6>
                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <span className="fs-small text-gray-700 me-2">
                                {assistance.attributes?.code || `ASS-${assistance.id}`}
                            </span>
                            {assistance.attributes?.asistence_category_name && (
                                <span className="badge bg-light-info fs-small text-gray-700">
                                    {assistance.attributes.asistence_category_name}
                                </span>
                            )}
                        </div>

                        {/* Badge de duración (similar al stock en productos) */}
                        {duration && (
                            <p className="m-0 item-badges">
                                <Badge
                                    bg="info"
                                    text="white"
                                    className="product-custom-card__card-badge"
                                >
                                    ⏱️ {duration}
                                </Badge>
                            </p>
                        )}

                        {/* Badge de precio */}
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
                                    assistance.attributes?.asistence_price
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
            className={`${posFilterAssistance && posFilterAssistance.length === 0
                ? "d-flex align-items-center justify-content-center"
                : ""
                } assistance-list-block pt-1`}
        >
            <audio ref={clickAudioRef} src={settings?.attributes?.click_audio} preload="auto" />
            <div className="d-flex flex-wrap product-list-block__product-block w-100">
                {posFilterAssistance && posFilterAssistance.length === 0 ? (
                    isLoading ? (
                        <Skelten />
                    ) : (
                        <h4 className="m-auto">
                            {getFormattedMessage(
                                "No hay servicios disponibles")
                                || "No hay servicios disponibles"}
                        </h4>
                    )
                ) : (
                    ""
                )}

                {posFilterAssistance &&
                    posFilterAssistance.map((assistance, index) => {
                        return loadAllAssistance(assistance, index);
                    })
                }

                {posAllAssistances.length < totalRecord && !isLoading && (
                    <div className="d-flex justify-content-center w-100 my-3">
                        <button
                            className="btn btn-outline-primary"
                            onClick={handleLoadMoreClick}
                            disabled={loadingMore}
                        >
                            {loadingMore
                                ? getFormattedMessage("loading.title") || "Cargando..."
                                : getFormattedMessage("load.more.title") || "Cargar más"
                            }
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

export default connect(mapStateToProps)(Assistance);

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { Col, Row, Button, Spinner } from "react-bootstrap-v5";
// import { connect } from "react-redux";
// import { getFormattedMessage, currencySymbolHandling } from "../../../shared/sharedMethod";

// const defaultImage = '/images/default-service-icon.png';

// // Componente AssistanceCard inline para evitar problemas de importación
// const AssistanceCard = ({ assistance, onAddToCart, isInCart, settings }) => {
//     if (!assistance || !assistance.attributes) {
//         console.warn('⚠️ AssistanceCard: Invalid assistance data:', assistance);
//         return null;
//     }

//     const {
//         id,
//         attributes: {
//             name = "Servicio sin nombre",
//             code = "",
//             asistence_price = 0,
//             asistence_cost = 0,
//             estimated_duration = 0,
//             description = "Servicio",
//             asistence_unit = "1",
//             image_url = defaultImage,
//             is_active = true
//         }
//     } = assistance;

//     // Formatear duración
//     const formatDuration = (minutes) => {
//         if (!minutes || minutes === 0) return 'No especificado';

//         if (minutes < 60) {
//             return `${minutes} min`;
//         }
//         const hours = Math.floor(minutes / 60);
//         const remainingMinutes = minutes % 60;
//         if (remainingMinutes === 0) {
//             return `${hours} hora${hours > 1 ? 's' : ''}`;
//         }
//         return `${hours}h ${remainingMinutes}m`;
//     };

//     // Formatear precio con símbolo de moneda
//     const formatPrice = (price) => {
//         if (settings && settings.attributes) {
//             return currencySymbolHandling(
//                 settings.attributes,
//                 settings.attributes.currency_symbol || '$',
//                 Number(price)
//             );
//         }
//         return `$ ${Number(price).toFixed(2)}`;
//     };

//     const handleAddToCart = () => {
//         if (!isInCart && onAddToCart) {
//             onAddToCart(assistance);
//         }
//     };

//     const handleImageError = (e) => {
//         e.target.src = defaultImage;
//     };

//     if (!is_active) {
//         return null; // No mostrar servicios inactivos
//     }

//     return (
//         <div className="card assistance-card h-100 shadow-sm">


//             <div className="card-body d-flex flex-column">
//                 {/* Nombre y código */}
//                 <h6 className="card-title fw-bold text-truncate" title={name}>
//                     {name}
//                 </h6>

//                 {code && (
//                     <div className="mb-2">
//                         <span className="badge bg-secondary text-uppercase">
//                             {code}
//                         </span>
//                     </div>
//                 )}

//                 <div className="position-relative">
//                     {/* Imagen del servicio */}
//                     <img
//                         className="card-img-top"
//                         src={image_url}
//                         alt={name}
//                         style={{
//                             height: '120px',
//                             objectFit: 'cover',
//                             backgroundColor: '#f8f9fa'
//                         }}
//                         onError={handleImageError}
//                     />

//                     {/* Badge de estado si está en carrito */}
//                     {isInCart && (
//                         <span
//                             className="badge bg-success position-absolute"
//                             style={{ top: '10px', right: '10px' }}
//                         >
//                         En Carrito
//                     </span>
//                     )}
//                 </div>

//                 {/* Descripción */}
//                 {description && description !== 'Servicio' && (
//                     <p className="text-muted small text-truncate mb-2" title={description}>
//                         {description}
//                     </p>
//                 )}

//                 {/* Duración */}
//                 <div className="mb-2">
//                     <small className="text-muted">
//                         <i className="fa fa-clock me-1"></i>
//                         Duración: <strong>{formatDuration(estimated_duration)}</strong>
//                     </small>
//                 </div>

//                 {/* Unidad si es diferente de "1" */}
//                 {asistence_unit && asistence_unit !== "1" && (
//                     <div className="mb-2">
//                         <small className="text-muted">
//                             Unidad: <strong>{asistence_unit}</strong>
//                         </small>
//                     </div>
//                 )}

//                 {/* Precios */}
//                 <div className="mb-3">
//                     <div className="d-flex justify-content-between align-items-center">
//                         <div>
//                             <div className="fw-bold text-primary fs-6">
//                                 {formatPrice(asistence_price)}
//                             </div>
//                             {asistence_cost > 0 && asistence_cost !== asistence_price && (
//                                 <small className="text-muted">
//                                     Costo: {formatPrice(asistence_cost)}
//                                 </small>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Botón agregar - siempre al final */}
//                 <div className="mt-auto">
//                     <Button
//                         variant={isInCart ? "success" : "primary"}
//                         size="sm"
//                         className="w-100"
//                         onClick={handleAddToCart}
//                         disabled={isInCart}
//                     >
//                         {isInCart ? (
//                             <>
//                                 <i className="fa fa-check me-1"></i>
//                                 En Carrito
//                             </>
//                         ) : (
//                             <>
//                                 <i className="fa fa-plus me-1"></i>
//                                 Agregar
//                             </>
//                         )}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const Assistance = ({
//     posAllAssistances = [],
//     cartProducts = [],
//     updateCart,
//     setCartAssistanceIds,
//     cartAssistanceIds = [],
//     settings,
//     selectedOption,
//     onScrollCallAPI,
//     page,
//     setPage,
//     addAssistanceToCart,
//     isAssistanceInCart
// }) => {
//     const [assistances, setAssistances] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [hasMore, setHasMore] = useState(true);
//     const scrollContainerRef = useRef();

//     useEffect(() => {
//         console.log('🔄 Assistances data updated:', {
//             count: posAllAssistances?.length || 0,
//             sample: posAllAssistances?.[0]
//         });

//         if (posAllAssistances && Array.isArray(posAllAssistances)) {
//             setAssistances(posAllAssistances);
//             setHasMore(posAllAssistances.length >= 30); // Assuming 30 items per page
//         }
//     }, [posAllAssistances]);

//     const handleScroll = useCallback(() => {
//         if (!scrollContainerRef.current || loading || !hasMore) return;

//         const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

//         // Cargar más cuando esté cerca del final (100px antes)
//         if (scrollHeight - scrollTop <= clientHeight + 100) {
//             if (selectedOption?.value && !loading) {
//                 console.log('📄 Loading more assistances, page:', page + 1);
//                 setLoading(true);
//                 setPage(page + 1);
//                 onScrollCallAPI(page + 1);

//                 // Reset loading after a timeout (fallback)
//                 setTimeout(() => setLoading(false), 3000);
//             }
//         }
//     }, [loading, hasMore, selectedOption, page, setPage, onScrollCallAPI]);

//     useEffect(() => {
//         const container = scrollContainerRef.current;
//         if (container) {
//             container.addEventListener('scroll', handleScroll);
//             return () => container.removeEventListener('scroll', handleScroll);
//         }
//     }, [handleScroll]);

//     const handleAddToCart = useCallback((assistance) => {
//         console.log('🛒 Adding assistance to cart:', assistance);

//         if (!assistance || !assistance.id) {
//             console.error('❌ Invalid assistance data');
//             return;
//         }

//         try {
//             // Preparar datos de la asistencia para el carrito
//             const preparedAssistance = {
//                 id: assistance.id,
//                 item_type: 'assistance',
//                 name: assistance.attributes?.name || 'Servicio sin nombre',
//                 code: assistance.attributes?.code || '',
//                 price: Number(assistance.attributes?.asistence_price || 0),
//                 cost: Number(assistance.attributes?.asistence_cost || 0),
//                 unit: assistance.attributes?.asistence_unit || '1',
//                 estimated_duration: Number(assistance.attributes?.estimated_duration || 0),
//                 quantity: 1,
//                 order_tax: Number(assistance.attributes?.order_tax || 0),
//                 tax_type: assistance.attributes?.tax_type || '1',
//                 description: assistance.attributes?.description || '',
//                 notes: assistance.attributes?.notes || '',
//                 category_id: assistance.attributes?.asistence_category_id,
//                 image_url: assistance.attributes?.image_path || defaultImage,
//                 attributes: assistance.attributes,
//                 // Campos adicionales para compatibilidad
//                 asistence_price: Number(assistance.attributes?.asistence_price || 0),
//                 asistence_cost: Number(assistance.attributes?.asistence_cost || 0),
//                 asistence_unit: assistance.attributes?.asistence_unit || '1'
//             };

//             // Usar la función del componente padre
//             if (addAssistanceToCart) {
//                 addAssistanceToCart(preparedAssistance);
//             } else {
//                 // Fallback: agregar manualmente
//                 const existingCart = [...cartProducts];
//                 const assistanceInCart = existingCart.find(
//                     item => item.id === assistance.id && item.item_type === 'assistance'
//                 );

//                 if (assistanceInCart) {
//                     assistanceInCart.quantity = (assistanceInCart.quantity || 1) + 1;
//                 } else {
//                     existingCart.push(preparedAssistance);
//                 }

//                 updateCart(existingCart);

//                 // Actualizar IDs
//                 const assistanceIds = existingCart
//                     .filter(item => item.item_type === 'assistance')
//                     .map(item => item.id);
//                 setCartAssistanceIds(assistanceIds);
//             }

//             console.log('✅ Assistance added to cart successfully');
//         } catch (error) {
//             console.error('❌ Error adding assistance to cart:', error);
//         }
//     }, [cartProducts, updateCart, setCartAssistanceIds, addAssistanceToCart]);

//     const checkIfInCart = useCallback((assistanceId) => {
//         if (isAssistanceInCart) {
//             return isAssistanceInCart(assistanceId);
//         }

//         return cartProducts.some(item =>
//             item.id === assistanceId && item.item_type === 'assistance'
//         );
//     }, [cartProducts, isAssistanceInCart]);

//     // Mostrar mensaje si no hay datos
//     if (!assistances || assistances.length === 0) {
//         return (
//             <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
//                 <div className="text-center">
//                     <h5 className="text-muted">
//                         {getFormattedMessage("No hay servicios disponibles") || "No hay servicios disponibles"}
//                     </h5>
//                     <p className="text-muted">
//                         {selectedOption?.value
//                             ? "No se encontraron servicios para este almacén"
//                             : "Seleccione un almacén para ver los servicios"
//                         }
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div
//             ref={scrollContainerRef}
//             className="assistance-list-container"
//             style={{
//                 height: '500px',
//                 overflow: 'auto',
//                 padding: '10px'
//             }}
//         >
//             <Row className="g-3">
//                 {assistances.map((assistance, index) => {
//                     const isInCart = checkIfInCart(assistance.id);

//                     return (
//                         <Col key={`assistance-${assistance.id}-${index}`} xs={12} sm={6} md={4} lg={3}>
//                             <AssistanceCard
//                                 assistance={assistance}
//                                 onAddToCart={handleAddToCart}
//                                 isInCart={isInCart}
//                                 settings={settings}
//                             />
//                         </Col>
//                     );
//                 })}
//             </Row>

//             {/* Loading indicator */}
//             {loading && (
//                 <div className="text-center py-3">
//                     <Spinner animation="border" variant="primary" size="sm" />
//                     <span className="ms-2">Cargando más servicios...</span>
//                 </div>
//             )}

//             {/* End message */}
//             {!loading && !hasMore && assistances.length > 0 && (
//                 <div className="text-center py-3">
//                     <p className="text-muted">
//                         <strong>¡Has visto todos los servicios!</strong>
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// };

// const mapStateToProps = (state) => {
//     return {
//         posAllAssistances: state.posAllAssistances || [],
//     };
// };

// export default connect(mapStateToProps)(Assistance);
