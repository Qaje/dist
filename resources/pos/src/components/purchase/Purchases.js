import React, { useEffect, useState } from "react";
import MasterLayout from "../MasterLayout";
import { connect } from "react-redux";
import moment from "moment";
import ReactDataTable from "../../shared/table/ReactDataTable";
import ActionDropDownButton from "../../shared/action-buttons/ActionDropDownButton";
import TabTitle from "../../shared/tab-title/TabTitle";
import { fetchPurchases } from "../../store/action/purchaseAction";
import DeletePurchase from "./DeletePurchase";
import {
    currencySymbolHandling,
    placeholderText,
} from "../../shared/sharedMethod";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { purchasePdfAction } from "../../store/action/purchasePdfAction";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import ShowPayment from "../../shared/showPayment/ShowPayment";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { useNavigate } from "react-router";

const Product = (props) => {
    const {
        fetchPurchases,
        purchases,
        totalRecord,
        isLoading,
        purchasePdfAction,
        frontSetting,
        fetchFrontSetting,
        allConfigData,
        isCallFetchDataApi
    } = props;
    const navigate = useNavigate();
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [isShowPaymentModel, setIsShowPaymentModel] = useState(false);
    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;
    const [tableArray, setTableArray] = useState([]);

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchPurchases(filter, true);
    };

    const goToEditProduct = (item) => {
        const id = item.id;
        window.location.href = "#/user/purchases/edit/" + id;
    };

    const goToDetailScreen = (ProductId) => {
        window.location.href = "#/user/purchases/detail/" + ProductId;
    };

    const onShowPaymentClick = () => {
        setIsShowPaymentModel(!isShowPaymentModel);
    };

    //onClick pdf function
    const onPdfClick = (id) => {
        purchasePdfAction(id);
    };

    const itemsValue =
        currencySymbol &&
        purchases.length >= 0 &&
        purchases.map((purchase) => {
            return {
                reference_code: purchase.attributes.reference_code,
                supplier: purchase.attributes.supplier_name,
                warehouse: purchase.attributes.warehouse_name,
                status: purchase.attributes.status,
                paid: 0,
                due: 0,
                payment_status: purchase.attributes.payment_status ? purchase.attributes.payment_status : 2,
                payment_type: purchase.attributes.payment_type,
                date: moment(purchase.attributes.date).format("YYYY-MM-DD"),
                time: moment(purchase.attributes.created_at).format("LT"),
                grand_total: purchase.attributes.grand_total,
                currency: currencySymbol,
                id: purchase.id,
                is_return: purchase.attributes.is_return,
            };
        });

    useEffect(() => {
        const grandTotalSum = () => {
            let x = 0;
            itemsValue.length &&
                itemsValue.map((item) => {
                    x = x + Number(item.grand_total);
                    return x;
                });
            return x;
        };
        if (purchases.length) {
            const newObject = itemsValue.length && {
                date: "",
                time: "",
                reference_code: "Total",
                customer_name: "",
                warehouse_name: "",
                status: "",
                payment_status: "",
                payment_type: "",
                grand_total: grandTotalSum(itemsValue),
                paid: 0,
                due: 0,
                id: "totalRows",
                payment: "",
                currency: currencySymbol,
            };
            const newItemValue =
                itemsValue.length && newObject && itemsValue.concat(newObject);
            const latestArray = newItemValue.map((item) => item);
            newItemValue.length && setTableArray(latestArray);
        }
    }, [purchases]);

    useEffect(() => {
        if (purchases.length === 0) {
            setTableArray([]);
        }
    }, [purchases]);

    const onCreatePurchaseReturnClick = (item) => {
        const id = item.id;
        navigate(
            item.is_return === 1
                ? "/user/purchases/return/edit/" + id
                : "/user/purchases/return/" + id
        );
    };

    const columns = [
        {
            name: getFormattedMessage("globally.detail.reference"),
            sortField: "reference_code",
            sortable: true,
            cell: (row) => {
                return row.reference_code === "Total" ? (
                    <span className="fw-bold fs-4">
                        {getFormattedMessage("pos-total.title")}
                    </span>
                ) : (
                    <span className="badge bg-light-danger">
                        <span>{row.reference_code}</span>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("supplier.title"),
            selector: (row) => row.supplier,
            sortField: "supplier",
            sortable: false,
        },
        {
            name: getFormattedMessage("warehouse.title"),
            selector: (row) => row.warehouse,
            sortField: "warehouse",
            sortable: false,
        },
        {
            name: getFormattedMessage("globally.detail.status"),
            sortField: "status",
            sortable: false,
            cell: (row) => {
                return (
                    (row.status === 1 && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.received.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 2 && (
                        <span className="badge bg-light-primary">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.pending.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 3 && (
                        <span className="badge bg-light-warning">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.ordered.label"
                                )}
                            </span>
                        </span>
                    ))
                );
            },
        },
        {
            name: getFormattedMessage("globally.detail.grand.total"),
            sortField: "grand_total",
            cell: (row) => {
                return row.reference_code === "Total" ? (
                    <span className="fw-bold fs-4">
                        {currencySymbolHandling(
                            allConfigData,
                            row.currency,
                            row.grand_total
                        )}
                    </span>
                ) : (
                    <span>
                        {currencySymbolHandling(
                            allConfigData,
                            row.currency,
                            row.grand_total
                        )}
                    </span>
                );
            },
            sortable: true,
        },
        {
            name: getFormattedMessage(
                "globally.detail.payment.status"
            ),
            selector: (row) => row.payment_status,
            sortField: "payment",
            sortField: "payment_status",
            sortable: false,
            cell: (row) => {
                return (
                    (row.payment_status === 1 && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "globally.detail.paid"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.payment_status === 2 && (
                        <span className="badge bg-light-danger">
                            <span>
                                {getFormattedMessage(
                                    "payment-status.filter.unpaid.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.payment_status === 3 && (
                        <span className="badge bg-light-warning">
                            <span>
                                {getFormattedMessage(
                                    "payment-status.filter.partial.label"
                                )}
                            </span>
                        </span>
                    ))
                );
            },
        },
        {
            name: getFormattedMessage("select.payment-type.label"),
            sortField: "payment_type",
            sortable: false,
            cell: (row) => {
                return (
                    (row.payment_type === 0 && (
                        <span className="w-50 fw-bold text-center">
                            <span>-</span>
                        </span>
                    )) ||
                    (row.payment_status !== 2 && row.payment_type === 1 && (
                        <span className="badge bg-light-primary">
                            <span>{getFormattedMessage("cash.label")}</span>
                        </span>
                    )) ||
                    (row.payment_status !== 2 && row.payment_type === 2 && (
                        <span className="badge bg-light-primary">
                            <span>
                                {getFormattedMessage(
                                    "payment-type.filter.cheque.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.payment_status !== 2 && row.payment_type === 3 && (
                        <span className="badge bg-light-primary">
                            <span>
                                {getFormattedMessage(
                                    "payment-type.filter.bank-transfer.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.payment_status !== 2 && row.payment_type === 4 && (
                        <span className="badge bg-light-primary">
                            <span>
                                {getFormattedMessage(
                                    "payment-type.filter.other.label"
                                )}
                            </span>
                        </span>
                    ))
                );
            },
        },
        {
            name: getFormattedMessage(
                "globally.react-table.column.created-date.label"
            ),
            selector: (row) => row.date,
            sortField: "date",
            sortable: true,
            cell: (row) => {
                return (
                    row.date && (
                        <span className="badge bg-light-info">
                            <div className="mb-1">{row.time}</div>
                            <div>{row.date}</div>
                        </span>
                    )
                );
            },
        },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: (row) =>
                row.reference_code === "Total" ? null : (
                    <ActionDropDownButton
                        item={row}
                        goToEditProduct={goToEditProduct}
                        isEditMode={true}
                        isPdfIcon={true}
                        onClickDeleteModel={onClickDeleteModel}
                        isViewIcon={true}
                        onPdfClick={onPdfClick}
                        goToDetailScreen={goToDetailScreen}
                        onShowPaymentClick={onShowPaymentClick}
                        title={getFormattedMessage("purchase.title")}
                        isCreatePurchaseReturn={true}
                        onCreatePurchaseReturnClick={onCreatePurchaseReturnClick}
                    />
                ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("purchases.title")} />
            <div className="purchases_table">
                <ReactDataTable
                    columns={columns}
                    items={tableArray}
                    onChange={onChange}
                    isLoading={isLoading}
                    isShowDateRangeField
                    buttonValue={getFormattedMessage("purchase.create.title")}
                    totalRows={totalRecord}
                    to="#/user/purchases/create"
                    isShowFilterField
                    isStatus
                    isCallFetchDataApi={isCallFetchDataApi}
                />
            </div>
            <DeletePurchase
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
            <ShowPayment
                onShowPaymentClick={onShowPaymentClick}
                isShowPaymentModel={isShowPaymentModel}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {
        purchases,
        totalRecord,
        isLoading,
        frontSetting,
        fetchFrontSetting,
        allConfigData,
        isCallFetchDataApi
    } = state;
    return {
        purchases,
        totalRecord,
        isLoading,
        frontSetting,
        fetchFrontSetting,
        allConfigData,
        isCallFetchDataApi
    };
};

export default connect(mapStateToProps, {
    fetchPurchases,
    purchasePdfAction,
    fetchFrontSetting,
})(Product);
