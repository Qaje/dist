import React, { useEffect } from "react";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import {
    currencySymbolHandling,
    getFormattedMessage,
    placeholderText,
} from "../../../shared/sharedMethod";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import { connect } from "react-redux";
import { fetchAllWarehouses } from "../../../store/action/warehouseAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import { fetchSuppliersReport } from "../../../store/action/suppliersReportAction";

const SuppliersReport = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchFrontSetting,
        fetchAllWarehouses,
        frontSetting,
        fetchSuppliersReport,
        allSupplierReport,
        allConfigData,
    } = props;

    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    useEffect(() => {
        fetchAllWarehouses();
    }, []);

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const itemsValue =
        currencySymbol &&
        allSupplierReport.length >= 0 &&
        allSupplierReport.map((report) => ({
            name: report.name,
            phone: report.phone,
            purchase: report.purchases_count,
            total_amount: report.total_grand_amount,
            id: report.id,
            currency: currencySymbol,
        }));

    const onChange = (filter) => {
        fetchSuppliersReport(filter, true);
    };

    const onReportsClick = (item) => {
        const id = item.id;
        window.location.href = "#/user/report/suppliers/details/" + id;
    };

    const columns = [
        {
            name: getFormattedMessage("globally.input.name.label"),
            sortField: "name",
            sortable: true,
            cell: (row) => {
                return (
                    <span className="badge bg-light-danger">
                        <span>{row.name}</span>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("globally.input.phone-number.label"),
            selector: (row) => row.phone,
            sortField: "phone",
            sortable: false,
        },
        {
            name: getFormattedMessage("purchases.title"),
            selector: (row) => row.purchase,
            sortField: "purchase",
            sortable: false,
        },
        {
            name: getFormattedMessage("pos-total-amount.title"),
            selector: (row) =>
                currencySymbolHandling(
                    allConfigData,
                    row.currency,
                    row.total_amount
                ),
            sortField: "total_amount",
            sortable: false,
        },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "115px",
            cell: (row) => (
                <button
                    className="btn btn-sm btn-primary"
                    variant="primary"
                    onClick={() => onReportsClick(row)}
                >
                    {getFormattedMessage("reports.title")}
                </button>
            ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("supplier.report.title")} />
            <div className="pt-md-7">
                <ReactDataTable
                    columns={columns}
                    items={itemsValue}
                    onChange={onChange}
                    isLoading={isLoading}
                    totalRows={totalRecord}
                />
            </div>
        </MasterLayout>
    );
};
const mapStateToProps = (state) => {
    const {
        isLoading,
        totalRecord,
        warehouses,
        frontSetting,
        allSupplierReport,
        allConfigData,
    } = state;
    return {
        isLoading,
        totalRecord,
        warehouses,
        frontSetting,
        allSupplierReport,
        allConfigData,
    };
};

export default connect(mapStateToProps, {
    fetchAllWarehouses,
    fetchFrontSetting,
    fetchSuppliersReport,
})(SuppliersReport);
