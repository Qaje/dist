import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import {
    currencySymbolHandling,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
import { fetchSales } from "../../../store/action/salesAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import {
    fetchConsolidatedSales,
    createConsolidatedPayment,
    clearConsolidatedPaymentError,
    resetConsolidatedSales,
    fetchConsolidatedHistory
} from "../../../store/action/consolidatedPaymentAction";
import CreatePaymentModal from "../../sales/CreatePaymentModal";
import { Button, Card, Row, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCreditCard,
    faUsers,
    faChartBar,
    faHistory,
    faExclamationTriangle,
    faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

const SaleConsolidadoTab = (props) => {
    const {
        isLoading,
        fetchSales,
        sales,
        frontSetting,
        fetchFrontSetting,
        warehouseValue,
        allConfigData,
        // Nuevas props de consolidated payments
        fetchConsolidatedSales,
        createConsolidatedPayment,
        clearConsolidatedPaymentError,
        resetConsolidatedSales,
        fetchConsolidatedHistory,
        consolidatedPayments
    } = props;

    const [isCreatePaymentOpen, setIsCreatePaymentOpen] = useState(false);
    const [createPaymentItem, setCreatePaymentItem] = useState({});
    const [consolidatedData, setConsolidatedData] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    // Extraer datos del estado de consolidated payments
    const {
        consolidatedSales = [],
        consolidatedSalesMeta = {},
        consolidatedHistory = [],
        consolidatedHistoryMeta = {},
        loading: consolidatedLoading = false,
        error: consolidatedError = null,
        lastCreatedPayment = null
    } = consolidatedPayments || {};

    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);

    useEffect(() => {
        console.log('🚀 SaleConsolidadoTab montado, cargando ventas consolidadas...');

        // Usar la nueva acción para obtener ventas consolidadas
        const filter = {
            warehouse_id: warehouseValue?.value || null
        };

        fetchConsolidatedSales(filter, true);

        // Limpiar al desmontar
        return () => {
            resetConsolidatedSales();
        };
    }, [warehouseValue, fetchConsolidatedSales, resetConsolidatedSales]);

    useEffect(() => {
        // Usar los datos de consolidated sales si están disponibles,
        // sino usar la lógica legacy con sales
        if (consolidatedSales && consolidatedSales.length > 0) {
            console.log('📊 Usando datos de consolidated sales:', consolidatedSales);
            setConsolidatedData(consolidatedSales);
        } else if (sales && sales.length > 0) {
            console.log('📊 Usando lógica legacy con sales:', sales);
            const consolidated = consolidateSalesByCustomer();
            setConsolidatedData(consolidated);
        } else {
            setConsolidatedData([]);
        }
    }, [consolidatedSales, sales, currencySymbol]);

    // Lógica legacy para consolidar ventas (fallback)
    const consolidateSalesByCustomer = () => {
        const customerMap = new Map();

        sales.forEach(sale => {
            const customerId = sale.attributes.customer_id || 'walk-in';
            const customerName = sale.attributes.customer_name || 'Walk-in Customer';
            const grandTotal = parseFloat(sale.attributes.grand_total) || 0;
            const paidAmount = parseFloat(sale.attributes.paid_amount) || 0;
            const dueAmount = grandTotal - paidAmount;

            if (dueAmount > 0) {
                if (customerMap.has(customerId)) {
                    const existing = customerMap.get(customerId);
                    existing.total_pending = (existing.total_pending || 0) + dueAmount;
                    existing.total_grand_total = (existing.total_grand_total || 0) + grandTotal;
                    existing.total_paid = (existing.total_paid || 0) + paidAmount;
                    existing.sales_count = (existing.sales_count || 0) + 1;
                    existing.sales_details.push({
                        id: sale.id,
                        reference_no: sale.attributes.reference_code,
                        date: sale.attributes.date,
                        created_at: sale.attributes.created_at,
                        grand_total: grandTotal,
                        paid_amount: paidAmount,
                        pending_amount: dueAmount,
                        payment_status: sale.attributes.payment_status
                    });
                } else {
                    customerMap.set(customerId, {
                        customer_id: customerId,
                        customer_name: customerName,
                        total_pending: dueAmount,
                        total_grand_total: grandTotal,
                        total_paid: paidAmount,
                        sales_count: 1,
                        currency: currencySymbol,
                        sales_details: [{
                            id: sale.id,
                            reference_no: sale.attributes.reference_code,
                            date: sale.attributes.date,
                            created_at: sale.attributes.created_at,
                            grand_total: grandTotal,
                            paid_amount: paidAmount,
                            pending_amount: dueAmount,
                            payment_status: sale.attributes.payment_status
                        }]
                    });
                }
            }
        });

        return Array.from(customerMap.values()).sort((a, b) => b.total_pending - a.total_pending);
    };

    const onCreatePaymentClick = (customer) => {
        console.log('💳 Iniciando creación de pago consolidado para:', customer);

        // Preparar datos para el modal de pago consolidado
        const paymentItem = {
            id: customer.customer_id,
            customer_name: customer.customer_name,
            customer_id: customer.customer_id,
            // Información consolidada
            total_due: customer.total_pending,
            total_grand: customer.total_grand_total,
            total_paid: customer.total_paid,
            sales_count: customer.sales_count,
            consolidated_sales: customer.sales_details,
            // Para compatibilidad con el modal existente
            grand_total: customer.total_pending,
            paid_amount: 0,
            reference_code: `CONSOLIDADO-${customer.customer_id}`,
            date: new Date().toISOString(),
            isConsolidated: true
        };

        setCreatePaymentItem(paymentItem);
        setIsCreatePaymentOpen(true);
    };

    const handlePaymentConfirm = async (paymentData) => {
        try {
            console.log('📤 Procesando pago consolidado:', paymentData);

            const consolidatedPaymentData = {
                customer_id: createPaymentItem.customer_id,
                payment_amount: paymentData.amount,
                payment_type: paymentData.payment_type,
                payment_note: paymentData.notes,
                sale_ids: createPaymentItem.consolidated_sales.map(sale => sale.id)
            };

            await createConsolidatedPayment(consolidatedPaymentData);

            // Refrescar datos después del pago exitoso
            const filter = {
                warehouse_id: warehouseValue?.value || null
            };
            fetchConsolidatedSales(filter, false);

            // Cerrar modal
            setIsCreatePaymentOpen(false);
            setCreatePaymentItem({});

        } catch (error) {
            console.error('❌ Error al crear pago consolidado:', error);
        }
    };

    const handleClearError = () => {
        clearConsolidatedPaymentError();
    };

    const handleToggleHistory = () => {
        if (!showHistory) {
            console.log('📋 Cargando historial de pagos consolidados...');
            const filter = {
                warehouse_id: warehouseValue?.value || null
            };
            fetchConsolidatedHistory(filter);
        }
        setShowHistory(!showHistory);
    };

    const columns = [
        {
            name: getFormattedMessage("customer.title"),
            selector: (row) => row.customer_name,
            sortField: "customer_name",
            sortable: true,
            minWidth: "200px",
        },
        {
            name: getFormattedMessage("sales.count.label") || "Sales Count",
            selector: (row) => row.sales_count,
            sortable: true,
            center: true,
            width: "120px",
        },
        {
            name: getFormattedMessage("globally.detail.grand.total"),
            selector: (row) =>
                currencySymbolHandling(
                    allConfigData,
                    row.currency || currencySymbol,
                    row.total_grand_total
                ),
            sortField: "total_grand_total",
            sortable: true,
            right: true,
            minWidth: "150px",
        },
        {
            name: getFormattedMessage("globally.detail.paid"),
            selector: (row) =>
                currencySymbolHandling(
                    allConfigData,
                    row.currency || currencySymbol,
                    row.total_paid
                ),
            sortField: "total_paid",
            sortable: true,
            right: true,
            minWidth: "150px",
        },
        {
            name: getFormattedMessage("globally.detail.due"),
            selector: (row) =>
                currencySymbolHandling(
                    allConfigData,
                    row.currency || currencySymbol,
                    row.total_pending
                ),
            sortField: "total_pending",
            sortable: true,
            right: true,
            minWidth: "150px",
            cell: (row) => (
                <span className="fw-bold text-danger">
                    {currencySymbolHandling(
                        allConfigData,
                        row.currency || currencySymbol,
                        row.total_pending
                    )}
                </span>
            ),
        },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "120px",
            cell: (row) => (
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onCreatePaymentClick(row)}
                    className="d-flex align-items-center gap-1"
                    disabled={consolidatedLoading}
                >
                    <FontAwesomeIcon icon={faCreditCard} />
                    {getFormattedMessage("create.payment.title") || "Pay"}
                </Button>
            ),
        },
    ];

    const onChange = (filter) => {
        // Para la nueva implementación, usar fetchConsolidatedSales
        const consolidatedFilter = {
            ...filter,
            warehouse_id: warehouseValue?.value || null
        };
        fetchConsolidatedSales(consolidatedFilter, true);
    };

    // Calcular estadísticas
    const totalCustomers = consolidatedSalesMeta.totalCustomers || consolidatedData.length;
    const totalPendingAmount = consolidatedSalesMeta.totalPendingAmount ||
        consolidatedData.reduce((sum, customer) => sum + (customer.total_pending || 0), 0);
    const totalSales = consolidatedData.reduce((sum, customer) => sum + (customer.sales_count || 0), 0);

    return (
        <div className="warehouse_sale_consolidado_table">
            {/* Header con estadísticas */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="d-flex align-items-center">
                            <div className="text-primary me-3">
                                <FontAwesomeIcon icon={faUsers} size="2x" />
                            </div>
                            <div>
                                <h5 className="mb-0">{totalCustomers}</h5>
                                <small className="text-muted">Clientes con deudas</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="d-flex align-items-center">
                            <div className="text-warning me-3">
                                <FontAwesomeIcon icon={faChartBar} size="2x" />
                            </div>
                            <div>
                                <h5 className="mb-0">{totalSales}</h5>
                                <small className="text-muted">Ventas pendientes</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="d-flex align-items-center">
                            <div className="text-danger me-3">
                                <FontAwesomeIcon icon={faCreditCard} size="2x" />
                            </div>
                            <div>
                                <h5 className="mb-0">
                                    {currencySymbolHandling(allConfigData, currencySymbol, totalPendingAmount)}
                                </h5>
                                <small className="text-muted">Total pendiente</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Botón para mostrar/ocultar historial */}
            {/*<div className="d-flex justify-content-between align-items-center mb-3">*/}
            {/*    <div></div>*/}
            {/*    <Button*/}
            {/*        variant="outline-secondary"*/}
            {/*        onClick={handleToggleHistory}*/}
            {/*        className="d-flex align-items-center gap-2"*/}
            {/*    >*/}
            {/*        <FontAwesomeIcon icon={faHistory} />*/}
            {/*        {showHistory ? 'Ocultar Historial' : 'Ver Historial'}*/}
            {/*    </Button>*/}
            {/*</div>*/}

            {/* Mostrar errores */}
            {consolidatedError && (
                <Alert variant="danger" dismissible onClose={handleClearError}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                    <strong>Error:</strong> {consolidatedError}
                </Alert>
            )}

            {/* Mostrar último pago creado */}
            {lastCreatedPayment && (
                <Alert variant="success" dismissible>
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    <strong>Pago consolidado creado exitosamente:</strong> {lastCreatedPayment.reference}
                    <br />
                    <small>
                        Monto: {currencySymbolHandling(allConfigData, currencySymbol, lastCreatedPayment.total_amount)}
                    </small>
                </Alert>
            )}

            {/* Información sobre la vista consolidada */}
            <Alert variant="info" className="mb-3">
                <strong>
                    {getFormattedMessage("consolidated.info.title") || "Vista Consolidada"}:
                </strong>{" "}
                {getFormattedMessage("consolidated.info.description") ||
                    "Esta vista muestra clientes con pagos pendientes (No pagado y Parcial). Los pagos se aplicarán a las ventas más antiguas primero (FIFO)."}
            </Alert>

            {/* Historial de pagos consolidados */}
            {showHistory && (
                <Card className="mb-4">
                    <Card.Header>
                        <h5 className="mb-0">
                            <FontAwesomeIcon icon={faHistory} className="me-2" />
                            Historial de Pagos Consolidados
                        </h5>
                    </Card.Header>
                    <Card.Body>
                        {consolidatedHistory.length === 0 ? (
                            <p className="text-muted mb-0">No hay historial de pagos consolidados.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Referencia</th>
                                            <th>Cliente</th>
                                            <th>Fecha</th>
                                            <th className="text-end">Monto</th>
                                            <th className="text-center">Ventas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {consolidatedHistory.map(payment => (
                                            <tr key={payment.id}>
                                                <td className="fw-bold">{payment.reference}</td>
                                                <td>{payment.customer_name}</td>
                                                <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                                                <td className="text-end fw-bold text-success">
                                                    {currencySymbolHandling(allConfigData, currencySymbol, payment.total_amount)}
                                                </td>
                                                <td className="text-center">
                                                    <span className="badge bg-secondary">
                                                        {payment.sales_count} venta{payment.sales_count !== 1 ? 's' : ''}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {consolidatedHistoryMeta.total > 0 && (
                            <div className="border-top pt-3 mt-3">
                                <Row>
                                    <Col md={6}>
                                        <small className="text-muted">
                                            <strong>Total de pagos:</strong> {consolidatedHistoryMeta.total}
                                        </small>
                                    </Col>
                                    <Col md={6} className="text-end">
                                        <small className="text-muted">
                                            <strong>Monto total:</strong> {' '}
                                            {currencySymbolHandling(allConfigData, currencySymbol, consolidatedHistoryMeta.totalAmount)}
                                        </small>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}

            {/* Tabla principal de ventas consolidadas */}
            <ReactDataTable
                columns={columns}
                items={consolidatedData}
                onChange={onChange}
                warehouseValue={warehouseValue}
                isLoading={consolidatedLoading || isLoading}
                totalRows={consolidatedData.length}
                isShowFilterField={false}
                paginationPerPage={25}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
            />

            {/* Modal de pago consolidado */}
            <CreatePaymentModal
                setIsCreatePaymentOpen={setIsCreatePaymentOpen}
                onCreatePaymentClick={() => setIsCreatePaymentOpen(!isCreatePaymentOpen)}
                isCreatePaymentOpen={isCreatePaymentOpen}
                createPaymentItem={createPaymentItem}
                onConfirm={handlePaymentConfirm}
                isConsolidated={true}
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    const { isLoading, sales, frontSetting, consolidatedPayments } = state;
    return {
        isLoading,
        sales,
        frontSetting,
        consolidatedPayments
    };
};

export default connect(mapStateToProps, {
    fetchFrontSetting,
    fetchSales,
    fetchConsolidatedSales,
    createConsolidatedPayment,
    clearConsolidatedPaymentError,
    resetConsolidatedSales,
    fetchConsolidatedHistory
})(SaleConsolidadoTab);
