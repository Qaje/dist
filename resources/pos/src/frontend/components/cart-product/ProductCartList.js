import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap-v5";
import {
    currencySymbolHandling,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
import { calculateProductCost } from "../../shared/SharedMethod";

const ProductCartList = (props) => {
    const {
        singleProduct,
        index,
        onClickUpdateItemInCart,
        onDeleteCartItem,
        frontSetting,
        allConfigData,
        setUpdateProducts,
    } = props;

    // Verificar si es producto o asistencia
    const isAssistance = singleProduct.item_type === 'assistance';

    const onIncrement = () => {
        if (isAssistance) {
            // Para asistencias, permitir incremento sin límite de stock
            setUpdateProducts((updateProducts) =>
                updateProducts.map((item) =>
                    item.id === singleProduct.id && item.item_type === 'assistance'
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            // Lógica original para productos
            if (singleProduct.quantity < singleProduct.attributes?.stock?.quantity) {
                setUpdateProducts((updateProducts) =>
                    updateProducts.map((item) =>
                        item.id === singleProduct.id && !item.item_type
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                );
            }
        }
    };

    const onDecrement = () => {
        if (singleProduct.quantity > 1) {
            setUpdateProducts((updateProducts) =>
                updateProducts.map((item) =>
                    item.id === singleProduct.id &&
                    (isAssistance ? item.item_type === 'assistance' : !item.item_type)
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
            );
        }
    };

    const onDeleteItem = () => {
        onDeleteCartItem(singleProduct.id, isAssistance ? 'assistance' : 'product');
    };

    // Calcular precio según el tipo
    const getItemPrice = () => {
        if (isAssistance) {
            return singleProduct.attributes?.price || singleProduct.price || 0;
        } else {
            return calculateProductCost(singleProduct).toFixed(2);
        }
    };

    // Calcular subtotal
    const getSubTotal = () => {
        const price = getItemPrice();
        return (price * singleProduct.quantity).toFixed(2);
    };

    // Obtener símbolo de moneda
    const getCurrencySymbol = () => {
        return currencySymbolHandling(
            allConfigData,
            frontSetting.attributes?.currency_symbol
        );
    };

    return (
        <tr>
            <td className="py-2">
                <div className="d-flex align-items-center">
                    {isAssistance && (
                        <span className="badge bg-info me-2 fs-8">
                            {getFormattedMessage("assistance.label")}
                        </span>
                    )}
                    <div>
                        <h6 className="mb-0 fs-6">
                            {singleProduct.attributes?.name || singleProduct.name}
                        </h6>
                        <small className="text-muted">
                            {isAssistance
                                ? (singleProduct.attributes?.code || `ASS-${singleProduct.id}`)
                                : singleProduct.attributes?.code
                            }
                        </small>
                        {isAssistance && (
                            <div>
                                <small className="text-info">
                                    {singleProduct.attributes?.duration || 1} {singleProduct.attributes?.duration_unit || 'Hour'}
                                </small>
                            </div>
                        )}
                    </div>
                </div>
            </td>
            <td className="py-2">
                <div className="d-flex align-items-center justify-content-center">
                    <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1 btn-icon"
                        onClick={onDecrement}
                        disabled={singleProduct.quantity <= 1}
                    >
                        <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <span className="mx-2 fw-bold fs-6">
                        {singleProduct.quantity}
                    </span>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        className="ms-1 btn-icon"
                        onClick={onIncrement}
                        disabled={!isAssistance && singleProduct.quantity >= singleProduct.attributes?.stock?.quantity}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </div>
            </td>
            <td className="py-2">
                <span className="fw-bold">
                    {getCurrencySymbol()}{getItemPrice()}
                </span>
            </td>
            <td className="py-2">
                <span className="fw-bold text-primary">
                    {getCurrencySymbol()}{getSubTotal()}
                </span>
            </td>
            <td className="py-2 text-end">
                <div className="d-flex justify-content-end">
                    {!isAssistance && (
                        <Button
                            variant="outline-info"
                            size="sm"
                            className="me-1 btn-icon"
                            onClick={() => onClickUpdateItemInCart(singleProduct)}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </Button>
                    )}
                    <Button
                        variant="outline-danger"
                        size="sm"
                        className="btn-icon"
                        onClick={onDeleteItem}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </div>
            </td>
        </tr>
    );
};

export default ProductCartList;
