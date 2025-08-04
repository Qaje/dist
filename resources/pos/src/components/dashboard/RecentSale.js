import React, { useEffect } from "react";
import { Card, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { connect } from "react-redux";
import {
    currencySymbolHandling,
    getFormattedMessage,
} from "../../shared/sharedMethod";
import { recentSales } from "../../store/action/recentSaleDashboardAction";

const RecentSale = (props) => {
    const { recentSales, recentSalesDashboard, frontSetting, allConfigData } =
        props;

    useEffect(() => {
        recentSales();
    }, []);

    // Función para validar y filtrar datos válidos
    const getValidSalesData = () => {
        if (!Array.isArray(recentSalesDashboard)) {
            return [];
        }

        return recentSalesDashboard.filter(sale =>
            sale &&
            sale.attributes &&
            typeof sale.attributes === 'object'
        );
    };

    const validSalesData = getValidSalesData();

    return (
        <div className="pt-6">
            <Row className="g-4">
                <div className="col-xxl-12 col-12">
                    <Card>
                        <Card.Header className="pb-0 px-10">
                            <h5 className="mb-0">
                                {getFormattedMessage(
                                    "dashboard.recentSales.title"
                                )}
                            </h5>
                        </Card.Header>
                        <Card.Body className="pt-7 pb-2">
                            <Table responsive>
                                <thead>
                                <tr>
                                    <th>
                                        {getFormattedMessage(
                                            "globally.detail.reference"
                                        )}
                                    </th>
                                    <th>
                                        {getFormattedMessage(
                                            "customer.title"
                                        )}
                                    </th>
                                    <th>
                                        {getFormattedMessage(
                                            "globally.detail.status"
                                        )}
                                    </th>
                                    <th>
                                        {getFormattedMessage(
                                            "globally.detail.grand.total"
                                        )}
                                    </th>
                                    <th>
                                        {getFormattedMessage(
                                            "globally.detail.paid"
                                        )}
                                    </th>
                                    <th>
                                        {getFormattedMessage(
                                            "globally.detail.due"
                                        )}
                                    </th>
                                    <th>
                                        {getFormattedMessage(
                                            "globally.detail.payment.status"
                                        )}
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="text-nowrap">
                                {validSalesData.length > 0 ? (
                                    validSalesData.map((recentSale, index) => {
                                        // Validación adicional por si acaso
                                        if (!recentSale?.attributes) {
                                            return null;
                                        }

                                        const attributes = recentSale.attributes;

                                        const renderTooltip = (props) => (
                                            <Tooltip
                                                id="button-tooltip"
                                                {...props}
                                            >
                                                {currencySymbolHandling(
                                                    allConfigData,
                                                    frontSetting?.value?.currency_symbol,
                                                    attributes.grand_total
                                                )}
                                            </Tooltip>
                                        );

                                        return (
                                            <tr key={recentSale.id || index}>
                                                <td className="py-4">
                                                    {attributes.reference_code || 'N/A'}
                                                </td>
                                                <td className="py-4">
                                                    {attributes.customer_name || 'N/A'}
                                                </td>
                                                <td className="py-4">
                                                    {attributes.status === 1 && (
                                                        <span className="badge bg-light-success">
                                                                {getFormattedMessage(
                                                                    "status.filter.complated.label"
                                                                )}
                                                            </span>
                                                    )}
                                                    {attributes.status === 2 && (
                                                        <span className="badge bg-light-primary">
                                                                <span>
                                                                    {getFormattedMessage(
                                                                        "status.filter.pending.label"
                                                                    )}
                                                                </span>
                                                            </span>
                                                    )}
                                                    {attributes.status === 3 && (
                                                        <span className="badge bg-light-warning">
                                                                <span>
                                                                    {getFormattedMessage(
                                                                        "status.filter.ordered.label"
                                                                    )}
                                                                </span>
                                                            </span>
                                                    )}
                                                </td>
                                                <td className="py-4">
                                                    <OverlayTrigger
                                                        placement="bottom"
                                                        delay={{
                                                            show: 250,
                                                            hide: 400,
                                                        }}
                                                        overlay={renderTooltip}
                                                    >
                                                            <span>
                                                                {currencySymbolHandling(
                                                                    allConfigData,
                                                                    frontSetting?.value?.currency_symbol,
                                                                    attributes.grand_total
                                                                )}
                                                            </span>
                                                    </OverlayTrigger>
                                                </td>
                                                <td className="py-4">
                                                    {currencySymbolHandling(
                                                        allConfigData,
                                                        frontSetting?.value?.currency_symbol,
                                                        attributes.paid_amount === null
                                                            ? "0.00"
                                                            : attributes.paid_amount
                                                    )}
                                                </td>
                                                <td className="py-4">
                                                    {currencySymbolHandling(
                                                        allConfigData,
                                                        frontSetting?.value?.currency_symbol,
                                                        attributes.due_amount ?? "0.00"
                                                    )}
                                                </td>
                                                <td className="py-4">
                                                    {attributes.payment_status === 1 && (
                                                        <span className="badge bg-light-success">
                                                                {getFormattedMessage(
                                                                    "globally.detail.paid"
                                                                )}
                                                            </span>
                                                    )}
                                                    {attributes.payment_status === 2 && (
                                                        <span className="badge bg-light-warning">
                                                                {getFormattedMessage(
                                                                    "payment-status.filter.unpaid.label"
                                                                )}
                                                            </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">
                                            {getFormattedMessage("table.no-data") || "No hay datos disponibles"}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </div>
            </Row>
        </div>
    );
};

const mapStateToProps = (state) => {
    const { recentSalesDashboard, allConfigData } = state;
    return { recentSalesDashboard, allConfigData };
};

export default connect(mapStateToProps, { recentSales })(RecentSale);
