import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import {
    formatDate,
    getFormattedDate,
    getFormattedMessage,
    getPaymentMethodName,
    placeholderText
} from "../../../shared/sharedMethod";
import TabTitle from "../../../shared/tab-title/TabTitle";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import { fetchSubscriptions } from "../../../store/action/admin/subscriptionAction";
import MasterLayout from "../../MasterLayout";
import { PLAN_STATUS } from "../../../constants";

const Subscriptions = ({ fetchSubscriptions, subscriptions, totalRecord, isLoading, allConfigData }) => {

    const onChange = (filter) => {
        fetchSubscriptions(filter, true);
    };

    const itemsValue =
        subscriptions.length >= 0 &&
        subscriptions.map((subscription) => ({
            date: getFormattedDate(
                subscription.attributes.created_at,
                allConfigData && allConfigData
            ),
            time: moment(subscription.attributes.created_at).format("LT"),
            id: subscription.id,
            payable_amount: subscription.attributes.currency_symbol + subscription.attributes.payable_amount,
            user_name: subscription.attributes.user_name,
            paid_via: getPaymentMethodName(subscription.attributes.payment_type),
            plan_name: subscription.attributes.plan_name,
            status: subscription.attributes.status,
            end_date: formatDate(subscription.attributes.end_date),
            start_date: formatDate(subscription.attributes.start_date),
        }));

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
            name: getFormattedMessage(
                "paid-via.title"
            ),
            selector: (row) => row.paid_via,
            sortField: "paid_via",
            sortable: false,
            cell: (row) => {
                return (
                    <span>
                        {getFormattedMessage(row.paid_via)}
                    </span>
                );
            }
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
                "globally.detail.status"
            ),
            selector: (row) => row.status,
            sortField: "status",
            sortable: false,
            cell: (row) => {
                return (
                    (row.status == PLAN_STATUS.ACTIVE && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "active.status.lable"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status == PLAN_STATUS.PENDING && (
                        <span className="badge bg-light-info">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.pending.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status == PLAN_STATUS.REJECTED && (
                        <span className="badge bg-light-danger">
                            <span>
                                {getFormattedMessage(
                                    "rejected.title"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status == PLAN_STATUS.INACTIVE && (
                        <span className="badge bg-light-danger">
                            <span>
                                {getFormattedMessage(
                                    "in-active.status.lable"
                                )}
                            </span>
                        </span>
                    ))
                );
            },
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("subscriptions.title")} />
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
    const { subscriptions, totalRecord, isLoading, allConfigData } = state;
    return { subscriptions, totalRecord, isLoading, allConfigData };
};

export default connect(mapStateToProps, { fetchSubscriptions })(Subscriptions);
