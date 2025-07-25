import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import ActionButton from "../../../shared/action-buttons/ActionButton";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import {
    formatDate,
    getFormattedDate,
    getFormattedMessage,
    placeholderText
} from "../../../shared/sharedMethod";
import TabTitle from "../../../shared/tab-title/TabTitle";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import { changeCashPaymentStatus, fetchCashPayments } from "../../../store/action/admin/cashPaymentsAction";
import MasterLayout from "../../MasterLayout";

const CashPayments = ({ fetchCashPayments, cashPayments, totalRecord, isLoading, allConfigData, changeCashPaymentStatus }) => {

    const onChange = (filter) => {
        fetchCashPayments(filter, true);
    };

    const itemsValue =
        cashPayments.length >= 0 &&
        cashPayments.map((cashPayment) => ({
            date: getFormattedDate(
                cashPayment.attributes.created_at,
                allConfigData && allConfigData
            ),
            time: moment(cashPayment.attributes.created_at).format("LT"),
            id: cashPayment.id,
            payable_amount: `${cashPayment.attributes.currency_symbol} ${cashPayment.attributes.payable_amount}`,
            user_name: cashPayment.attributes.user_name,
            paid_via: getFormattedMessage("manually.title"),
            plan_name: cashPayment.attributes.plan_name,
            price: `${cashPayment.attributes.currency_symbol} ${cashPayment.attributes.plan_amount}`,
            end_date: formatDate(cashPayment.attributes.end_date),
            start_date: formatDate(cashPayment.attributes.start_date),
            status: cashPayment.attributes.status,
        }));

    const onStatusChange = (status, id) => {
        const data = {
            status,
        };
        changeCashPaymentStatus(id, data);
    };

    const columns = [
        {
            name: getFormattedMessage(
                "user-name.title"
            ),
            selector: (row) => row.user_name,
            sortField: "user_name",
            sortable: false,
        },
        {
            name: getFormattedMessage(
                "plan-name.title"
            ),
            selector: (row) => row.plan_name,
            sortField: "plan_name",
            sortable: false,
        },
        {
            name: getFormattedMessage(
                "globally.plan.price.title"
            ),
            selector: (row) => row.price,
            sortField: "price",
            sortable: false,
        },
        {
            name: getFormattedMessage(
                "payable-amount.title"
            ),
            selector: (row) => row.payable_amount,
            sortField: "payable_amount",
            sortable: false,
        },
        {
            name: getFormattedMessage(
                "globally.plan.start.date.title"
            ),
            selector: (row) => row.start_date,
            sortField: "start_date",
            sortable: false,
        },
        {
            name: getFormattedMessage(
                "globally.plan.end.date.title"
            ),
            selector: (row) => row.end_date,
            sortField: "end_date",
            sortable: false,
        },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: (row) => (
                <ActionButton
                    item={row}
                    isDeleteMode={false}
                    isEditMode={false}
                    isActionDropDown
                    onStatusChange={onStatusChange}
                    isCustomWidth
                />
            ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("cash-payments.title")} />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                isLoading={isLoading}
                totalRows={totalRecord}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { cashPayments, totalRecord, isLoading, allConfigData } = state;
    return { cashPayments, totalRecord, isLoading, allConfigData };
};

export default connect(mapStateToProps, { fetchCashPayments, changeCashPaymentStatus })(CashPayments);
