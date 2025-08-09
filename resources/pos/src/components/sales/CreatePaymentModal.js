import React, { useEffect, useState } from "react";
import { Modal, Table, Alert } from "react-bootstrap-v5";
import {
    decimalValidate,
    getFormattedMessage,
    getFormattedOptions,
    placeholderText,
    currencySymbolHandling,
} from "../../shared/sharedMethod";
import moment from "moment";
import { Row } from "reactstrap";
import ReactDatePicker from "../../shared/datepicker/ReactDatePicker";
import { paymentMethodOptions } from "../../constants";
import ReactSelect from "../../shared/select/reactSelect";
import ModelFooter from "../../shared/components/modelFooter";
import { useDispatch } from "react-redux";
import { createSalePayment } from "../../store/action/salePaymentAction";
import { createConsolidatedPayment, calculatePaymentAllocation } from "../../store/action/consolidatedPaymentAction";

const CreatePaymentModal = (props) => {
    const {
        onCreatePaymentClick,
        isCreatePaymentOpen,
        createPaymentItem,
        setIsCreatePaymentOpen,
        allConfigData,
    } = props;

    const dispatch = useDispatch();
    const [paymentValue, setPaymentValue] = useState({
        reference: "",
        payment_date: new Date(),
        payment_type: "",
        amount: "",
        paid_amount: "",
        sale_id: "",
        amount_to_pay: "",
    });

    const [isConsolidatedPayment, setIsConsolidatedPayment] = useState(false);

    useEffect(() => {
        if (createPaymentItem) {
            // Check if this is a consolidated payment (has multiple sales)
            const isConsolidated = createPaymentItem.consolidated_sales &&
                createPaymentItem.consolidated_sales.length > 1;

            setIsConsolidatedPayment(isConsolidated);

            // Calcular totales de forma segura
            const totalDue = parseFloat(createPaymentItem?.total_due) || 0;
            const grandTotal = parseFloat(createPaymentItem?.grand_total) || 0;
            const paidAmount = parseFloat(createPaymentItem?.paid_amount) || 0;
            const amountToPay = isConsolidated ? totalDue : (grandTotal - paidAmount);

            setPaymentValue({
                payment_type: paymentTypeDefaultValue && paymentTypeDefaultValue[0],
                payment_date: moment(createPaymentItem?.date, moment.ISO_8601, true).isValid()
                    ? moment(createPaymentItem?.date).toDate()
                    : new Date(),
                amount_to_pay: amountToPay,
                sale_id: createPaymentItem ? createPaymentItem?.id : "",
                amount: amountToPay,
                reference: isConsolidated
                    ? `CONSOLIDADO-${createPaymentItem.customer_name || 'customer'}-${moment().format('YYYYMMDD')}`
                    : "",
            });
        }
    }, [createPaymentItem, paymentTypeDefaultValue]);

    const paymentMethodOption = getFormattedOptions(paymentMethodOptions);
    const paymentTypeDefaultValue = paymentMethodOption.map((option) => {
        return {
            value: option.id,
            label: option.name,
        };
    });

    const sanitizeValue = (value, fallback = '') => {
        if (value === null || value === undefined ||
            (typeof value === 'number' && isNaN(value)) ||
            value === 'undefined' || value === 'NaN') {
            return fallback;
        }
        return String(value);
    };

    // 3. Crear función calculatePaymentAllocation local como fallback
    const calculatePaymentAllocationLocal = (consolidatedSales, paymentAmount) => {
        if (!consolidatedSales || !Array.isArray(consolidatedSales) || !paymentAmount) {
            return {
                allocations: [],
                totalAllocated: 0,
                remainingPayment: parseFloat(paymentAmount) || 0
            };
        }

        const totalPayment = parseFloat(paymentAmount);
        if (isNaN(totalPayment) || totalPayment <= 0) {
            return {
                allocations: [],
                totalAllocated: 0,
                remainingPayment: 0
            };
        }

        const sortedSales = [...consolidatedSales].sort((a, b) =>
            new Date(a.created_at) - new Date(b.created_at)
        );

        const allocations = [];
        let remainingPayment = totalPayment;

        for (const sale of sortedSales) {
            if (remainingPayment <= 0) break;

            const grandTotal = parseFloat(sale.grand_total) || 0;
            const paidAmount = parseFloat(sale.paid_amount) || 0;
            const dueAmount = grandTotal - paidAmount;

            if (dueAmount > 0) {
                const allocationAmount = Math.min(dueAmount, remainingPayment);

                allocations.push({
                    sale_id: sale.id,
                    reference_code: sale.reference_code,
                    due_amount: dueAmount,
                    allocated_amount: allocationAmount,
                    remaining_due: dueAmount - allocationAmount,
                    grand_total: grandTotal,
                    paid_amount: paidAmount
                });

                remainingPayment -= allocationAmount;
            }
        }

        const totalAllocated = totalPayment - remainingPayment;

        return {
            allocations,
            totalAllocated,
            remainingPayment
        };
    };


    const handleCallback = (date) => {
        setPaymentValue((previousState) => {
            return { ...previousState, payment_date: date };
        });
    };

    const onPaymentMethodChange = (obj) => {
        setPaymentValue((paymentValue) => ({
            ...paymentValue,
            payment_type: obj,
        }));
    };

    const [errors, setErrors] = useState({
        amount: "",
    });

    const handleValidation = () => {
        let error = {};
        let isValid = false;
        if (!paymentValue["amount"]) {
            error["amount"] = getFormattedMessage(
                "globally.require-input.validate.label"
            );
        } else if (
            paymentValue["amount"] &&
            paymentValue["amount"] > paymentValue["amount_to_pay"]
        ) {
            error["amount"] = getFormattedMessage(
                "paying-amount-validate-label"
            );
        } else {
            isValid = true;
        }
        setErrors(error);
        return isValid;
    };

    const prepareFormData = (prepareData) => {
        if (isConsolidatedPayment) {
            // For consolidated payments, we need to handle multiple sales
            return {
                reference: prepareData.reference,
                payment_date: moment(prepareData.payment_date).format("YYYY-MM-DD"),
                payment_type: prepareData.payment_type.value,
                amount: prepareData.amount,
                consolidated_sales: createPaymentItem.consolidated_sales,
                is_consolidated: true,
                customer_id: createPaymentItem.customer_id,
            };
        } else {
            // Single sale payment (existing logic)
            return {
                reference: prepareData.reference,
                payment_date: moment(prepareData.payment_date).format("YYYY-MM-DD"),
                payment_type: prepareData.payment_type.value,
                amount: prepareData.amount,
                sale_id: prepareData.sale_id,
                received_amount: prepareData.amount_to_pay,
            };
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (valid) {
            if (isConsolidatedPayment) {
                // Usar función local si la importada no existe
                const calculateFunction = calculatePaymentAllocation || calculatePaymentAllocationLocal;

                const allocation = calculateFunction(
                    createPaymentItem.consolidated_sales,
                    paymentValue.amount
                );

                const consolidatedPaymentData = {
                    ...prepareFormData(paymentValue),
                    payment_allocation: allocation.allocations,
                    total_allocated: allocation.totalAllocated,
                    remaining_payment: allocation.remainingPayment
                };

                dispatch(createConsolidatedPayment(consolidatedPaymentData));
            } else {
                dispatch(createSalePayment(prepareFormData(paymentValue)));
            }
            setIsCreatePaymentOpen(false);
        }
    };

    const clearField = () => {
        setIsCreatePaymentOpen(false);
    };

    const onChangeAmount = (e) => {
        const value = e.target.value;
        // Permitir solo números y decimales
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setPaymentValue((paymentValue) => ({
                ...paymentValue,
                amount: value,
            }));
        }
    };

    const onChangeReference = (e) => {
        setPaymentValue((paymentValue) => ({
            ...paymentValue,
            reference: e.target.value,
        }));
    };

    // Sort sales by date (oldest first) for display
    const sortedConsolidatedSales = isConsolidatedPayment
        ? createPaymentItem.consolidated_sales?.sort((a, b) =>
            new Date(a.created_at) - new Date(b.created_at)
        ) || []
        : [];

    return (
        <Modal
            show={isCreatePaymentOpen}
            onHide={onCreatePaymentClick}
            size={isConsolidatedPayment ? "xl" : "lg"}
            keyboard={true}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {isConsolidatedPayment
                        ? getFormattedMessage("create-consolidated-payment-title") || "Create Consolidated Payment"
                        : getFormattedMessage("create-payment-title")
                    }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isConsolidatedPayment && (
                    <Alert variant="info" className="mb-4">
                        <p className="mb-0">
                            <strong>Customer:</strong> {createPaymentItem?.customer_name}<br />
                            <strong>Total Outstanding:</strong> {
                                createPaymentItem?.total_due &&
                                currencySymbolHandling(
                                    allConfigData,
                                    createPaymentItem?.currency,
                                    createPaymentItem.total_due
                                )
                            }
                        </p>
                    </Alert>
                )}

                <Row>
                    <div className="col-4 mb-3">
                        <label className="form-label">
                            {getFormattedMessage(
                                "react-data-table.date.column.label"
                            )}{" "}
                            :
                        </label>
                        <ReactDatePicker
                            onChangeDate={handleCallback}
                            newStartDate={
                                paymentValue.payment_date
                                    ? paymentValue.payment_date
                                    : new Date()
                            }
                        />
                    </div>
                    <div className="col-4 mb-3">
                        <label className="form-label">
                            {getFormattedMessage("globally.detail.reference")} :
                        </label>
                        <input
                            type="text"
                            name="reference"
                            placeholder={placeholderText(
                                "reference-placeholder-label"
                            )}
                            className="form-control"
                            autoFocus={true}
                            onChange={(e) => onChangeReference(e)}
                            value={paymentValue.reference}
                        />
                    </div>
                    <div className="col-4 mb-3">
                        <ReactSelect
                            title={getFormattedMessage(
                                "select.payment-type.label"
                            )}
                            defaultValue={paymentTypeDefaultValue[0]}
                            multiLanguageOption={paymentMethodOption}
                            onChange={onPaymentMethodChange}
                        />
                    </div>
                    <div className="col-4">
                        <label className="form-label">
                            {isConsolidatedPayment
                                ? getFormattedMessage("total-amount-to-pay-title") || "Total Amount to Pay"
                                : getFormattedMessage("input-Amount-to-pay-title")
                            } :
                        </label>
                        <input
                            type="text"
                            name="amount_to_pay"
                            placeholder="Enter Reference"
                            className="form-control"
                            autoFocus={false}
                            readOnly={true}
                            value={sanitizeValue(paymentValue.amount_to_pay, '0')}
                        />
                    </div>
                    <div className="col-4">
                        <label className="form-label">
                            {getFormattedMessage("paying-amount-title")} :
                        </label>
                        <span className="required" />
                        <input
                            type="text"
                            name="amount"
                            placeholder={placeholderText("paying-amount-title")}
                            className="form-control"
                            autoFocus={true}
                            onKeyPress={(event) => decimalValidate(event)}
                            onChange={(e) => onChangeAmount(e)}
                            value={sanitizeValue(paymentValue.amount, '')}
                        />
                        <span className="text-danger d-block fw-400 fs-small mt-2">
                            {errors["amount"] ? errors["amount"] : null}
                        </span>
                    </div>
                </Row>

                {/* Show consolidated sales details */}
                {isConsolidatedPayment && sortedConsolidatedSales.length > 0 && (
                    <div className="mt-4">
                        <h6>{getFormattedMessage("pending.sales.details") || "Pending Sales Details"}</h6>
                        <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <Table  className="mb-0">
                                <thead className="position-sticky top-0">
                                    <tr>
                                        <th>{getFormattedMessage("globally.detail.reference")}</th>
                                        <th>{getFormattedMessage("react-data-table.date.column.label")}</th>
                                        <th>{getFormattedMessage("globally.detail.grand.total")}</th>
                                        <th>{getFormattedMessage("globally.detail.paid")}</th>
                                        <th>{getFormattedMessage("globally.detail.due")}</th>
                                        <th>{getFormattedMessage("globally.detail.payment.status")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {/*En la tabla, usar sanitizeValue para los valores de moneda*/}
                                {/*// En el componente CreatePaymentModal.js, actualiza la sección de la tabla:*/}
                                {sortedConsolidatedSales.map((sale, index) => (
                                    <tr key={sale.id} className={index === 0 ? "table-warning" : ""}>
                                        <td>
            <span className="badge bg-light-danger">
                {sanitizeValue(sale.reference_code, 'N/A')}
            </span>
                                            {index === 0 && (
                                                <div className="small text-muted mt-1">
                                                    {getFormattedMessage("oldest.sale.first") || "Oldest - Will be paid first"}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <small>
                                                {moment(sale.created_at).format('DD/MM/YYYY')}
                                            </small>
                                        </td>
                                        <td>
                                            {currencySymbolHandling(
                                                allConfigData,
                                                sale.currency || createPaymentItem?.currency, // Usar currency de la venta o del item
                                                parseFloat(sale.grand_total) || 0
                                            )}
                                        </td>
                                        <td>
                                            {currencySymbolHandling(
                                                allConfigData,
                                                sale.currency || createPaymentItem?.currency,
                                                parseFloat(sale.paid_amount) || 0
                                            )}
                                        </td>
                                        <td>
            <span className="fw-bold text-danger">
                {currencySymbolHandling(
                    allConfigData,
                    sale.currency || createPaymentItem?.currency,
                    (parseFloat(sale.grand_total) || 0) - (parseFloat(sale.paid_amount) || 0)
                )}
            </span>
                                        </td>
                                        <td>
                                            {sale.payment_status === 2 && (
                                                <span className="badge bg-light-danger">
                    {getFormattedMessage("payment-status.filter.unpaid.label")}
                </span>
                                            )}
                                            {sale.payment_status === 3 && (
                                                <span className="badge bg-light-warning">
                    {getFormattedMessage("payment-status.filter.partial.label")}
                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                        {/*<Alert variant="warning" className="mt-3">*/}
                        {/*    <small>*/}
                        {/*        <strong>{getFormattedMessage("payment.allocation.note") || "Note"}:</strong>{" "}*/}
                        {/*        {getFormattedMessage("payment.allocation.description") ||*/}
                        {/*            "The payment amount will be allocated to sales starting from the oldest (highlighted in yellow) and moving to newer sales until the payment amount is exhausted."}*/}
                        {/*    </small>*/}
                        {/*</Alert>*/}
                    </div>
                )}

                <ModelFooter clearField={clearField} onSubmit={onSubmit} />
            </Modal.Body>
        </Modal>
    );
};

export default CreatePaymentModal;
