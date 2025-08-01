import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap-v5';
import { currencySymbolHandling, getFormattedMessage } from '../../../shared/sharedMethod';

const AssistanceCard = ({ assistance, onAddToCart, isInCart, settings }) => {
    if (!assistance || !assistance.attributes) {
        console.warn('⚠️ AssistanceCard: Invalid assistance data:', assistance);
        return null;
    }

    const {
        id,
        attributes: {
            name = "Servicio sin nombre",
            code = "",
            asistence_price = 0,
            asistence_cost = 0,
            estimated_duration = 0,
            description = "Servicio",
            asistence_unit = "1",
            image_url = '/images/default-service-icon.png',
            is_active = true
        }
    } = assistance;

    // Formatear duración
    const formatDuration = (minutes) => {
        if (!minutes || minutes === 0) return 'No especificado';

        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) {
            return `${hours} hora${hours > 1 ? 's' : ''}`;
        }
        return `${hours}h ${remainingMinutes}m`;
    };

    // Formatear precio con símbolo de moneda
    const formatPrice = (price) => {
        if (settings && settings.attributes) {
            return currencySymbolHandling(
                settings.attributes,
                settings.attributes.currency_symbol || '$',
                Number(price)
            );
        }
        return `$ ${Number(price).toFixed(2)}`;
    };

    const handleAddToCart = () => {
        if (!isInCart && onAddToCart) {
            onAddToCart(assistance);
        }
    };

    const handleImageError = (e) => {
        e.target.src = '/images/default-service-icon.png';
    };

    if (!is_active) {
        return null; // No mostrar servicios inactivos
    }

    return (
        <Card className="assistance-card h-100 shadow-sm">
            <div className="position-relative">
                {/* Imagen del servicio */}
                <Card.Img
                    variant="top"
                    src={image_url}
                    alt={name}
                    style={{
                        height: '120px',
                        objectFit: 'cover',
                        backgroundColor: '#f8f9fa'
                    }}
                    onError={handleImageError}
                />

                {/* Badge de estado si está en carrito */}
                {isInCart && (
                    <Badge
                        bg="success"
                        className="position-absolute"
                        style={{ top: '10px', right: '10px' }}
                    >
                        En Carrito
                    </Badge>
                )}
            </div>

            <Card.Body className="d-flex flex-column">
                {/* Nombre y código */}
                <Card.Title className="fw-bold text-truncate" title={name}>
                    {name}
                </Card.Title>

                {code && (
                    <div className="mb-2">
                        <Badge bg="secondary" className="text-uppercase">
                            {code}
                        </Badge>
                    </div>
                )}

                {/* Descripción */}
                {description && description !== 'Servicio' && (
                    <p className="text-muted small text-truncate mb-2" title={description}>
                        {description}
                    </p>
                )}

                {/* Duración */}
                <div className="mb-2">
                    <small className="text-muted">
                        <i className="fa fa-clock me-1"></i>
                        Duración: <strong>{formatDuration(estimated_duration)}</strong>
                    </small>
                </div>

                {/* Unidad si es diferente de "1" */}
                {asistence_unit && asistence_unit !== "1" && (
                    <div className="mb-2">
                        <small className="text-muted">
                            Unidad: <strong>{asistence_unit}</strong>
                        </small>
                    </div>
                )}

                {/* Precios */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <div className="fw-bold text-primary fs-5">
                                {formatPrice(asistence_price)}
                            </div>
                            {asistence_cost > 0 && asistence_cost !== asistence_price && (
                                <small className="text-muted">
                                    Costo: {formatPrice(asistence_cost)}
                                </small>
                            )}
                        </div>
                    </div>
                </div>

                {/* Botón agregar - siempre al final */}
                <div className="mt-auto">
                    <Button
                        variant={isInCart ? "success" : "primary"}
                        size="sm"
                        className="w-100"
                        onClick={handleAddToCart}
                        disabled={isInCart}
                    >
                        {isInCart ? (
                            <>
                                <i className="fa fa-check me-1"></i>
                                En Carrito
                            </>
                        ) : (
                            <>
                                <i className="fa fa-plus me-1"></i>
                                Agregar
                            </>
                        )}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default AssistanceCard;
