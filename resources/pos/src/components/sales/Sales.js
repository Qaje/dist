import React, { useEffect, useState } from "react";
import moment from "moment";
import { connect, useDispatch, useSelector } from "react-redux";
import MasterLayout from "../MasterLayout";
import TabTitle from "../../shared/tab-title/TabTitle";
import ReactDataTable from "../../shared/table/ReactDataTable";
import { fetchSales } from "../../store/action/salesAction";
import DeleteSale from "./DeleteSale";
import {
    currencySymbolHandling,
    getFormattedDate,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import { salePdfAction } from "../../store/action/salePdfAction";
import ActionDropDownButton from "../../shared/action-buttons/ActionDropDownButton";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import ShowPayment from "../../shared/showPayment/ShowPayment";
import CreatePaymentModal from "./CreatePaymentModal";
import { fetchSalePayments } from "../../store/action/salePaymentAction";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const Sales = (props) => {
    const {
        sales,
        fetchSales,
        totalRecord,
        isLoading,
        salePdfAction,
        fetchFrontSetting,
        frontSetting,
        isCallSaleApi,
        allConfigData,
        isCallFetchDataApi
    } = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isShowPaymentModel, setIsShowPaymentModel] = useState(false);
    const [isCreatePaymentOpen, setIsCreatePaymentOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [createPaymentItem, setCreatePaymentItem] = useState({});
    const { allSalePayments } = useSelector((state) => state);
    const [tableArray, setTableArray] = useState([]);

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    const onChange = (filter) => {
        fetchSales(filter, true);
    };

    //sale edit function
    const goToEdit = (item) => {
        const id = item.id;
        window.location.href = "#/user/sales/edit/" + id;
    };

    // delete sale function
    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };
    const dispatch = useDispatch();

    const onShowPaymentClick = (item) => {
        setIsShowPaymentModel(!isShowPaymentModel);
        setCreatePaymentItem(item);
        if (item) {
            dispatch(fetchSalePayments(item.id));
        }
    };

    const onCreatePaymentClick = (item) => {
        setIsCreatePaymentOpen(!isCreatePaymentOpen);
        setCreatePaymentItem(item);
        if (item) {
            dispatch(fetchSalePayments(item.id));
        }
    };

    //sale details function
    const goToDetailScreen = (ProductId) => {
        window.location.href = "#/user/sales/detail/" + ProductId;
    };

    //onClick pdf function
    const onPdfClick = (id) => {
        salePdfAction(id);
    };

    const onCreateSaleReturnClick = (item) => {
        const id = item.id;
        window.location.href =
            item.is_return === 1
                ? "#/user/sales/return/edit/" + id
                : "#/user/sales/return/" + id;
    };

    // Función auxiliar para verificar si un objeto tiene las propiedades necesarias
    const isSaleValid = (sale) => {
        return sale && sale.attributes && typeof sale.attributes === 'object';
    };

    // Función auxiliar para obtener valor seguro
    const getSafeValue = (obj, path, defaultValue = '') => {
        try {
            return path.split('.').reduce((o, p) => o && o[p], obj) || defaultValue;
        } catch (error) {
            console.warn('Error accessing path:', path, error);
            return defaultValue;
        }
    };

    const itemsValue = currencySymbol && sales && Array.isArray(sales) && sales.length > 0
        ? sales
            .filter(isSaleValid) // Filtrar solo las ventas válidas
            .map((sale) => {
                try {
                    return {
                        date: sale.attributes.created_at
                            ? getFormattedDate(sale.attributes.created_at, allConfigData)
                            : '',
                        time: sale.attributes.created_at
                            ? moment(sale.attributes.created_at).format("LT")
                            : '',
                        reference_code: getSafeValue(sale, 'attributes.reference_code', ''),
                        customer_name: getSafeValue(sale, 'attributes.customer_name', ''),
                        user_name: getSafeValue(sale, 'attributes.user_name', ''),
                        warehouse_name: getSafeValue(sale, 'attributes.warehouse_name', ''),
                        status: getSafeValue(sale, 'attributes.status', 0),
                        payment_status: getSafeValue(sale, 'attributes.payment_status', 0),
                        payment_type: getSafeValue(sale, 'attributes.payment_type', 0),
                        grand_total: getSafeValue(sale, 'attributes.grand_total', 0),
                        paid_amount: sale.attributes.paid_amount
                            ? sale.attributes.paid_amount
                            : (0.0).toFixed(2),
                        id: sale.id || '',
                        currency: currencySymbol,
                        is_return: getSafeValue(sale, 'attributes.is_return', 0),
                    };
                } catch (error) {
                    console.error('Error processing sale item:', sale, error);
                    return null;
                }
            })
            .filter(Boolean) // Remover elementos null
        : [];

    useEffect(() => {
        const grandTotalSum = (items) => {
            let x = 0;
            if (items && items.length) {
                items.forEach((item) => {
                    if (item && typeof item.grand_total === 'number') {
                        x += Number(item.grand_total);
                    }
                });
            }
            return x;
        };

        const paidTotalSum = (items) => {
            let x = 0;
            if (items && items.length) {
                items.forEach((item) => {
                    if (item && typeof item.paid_amount !== 'undefined') {
                        x += Number(item.paid_amount);
                    }
                });
            }
            return x;
        };

        if (sales && sales.length && itemsValue && itemsValue.length) {
            const newObject = {
                date: "",
                time: "",
                reference_code: "Total",
                customer_name: "",
                warehouse_name: "",
                status: "",
                payment_status: "",
                payment_type: "",
                grand_total: grandTotalSum(itemsValue),
                paid_amount: paidTotalSum(itemsValue),
                id: "totalRows",
                currency: currencySymbol,
            };

            const newItemValue = [...itemsValue, newObject];
            setTableArray(newItemValue);
        } else {
            setTableArray([]);
        }
    }, [sales, currencySymbol, allConfigData]);

    // Debug: Agregar console.log para monitorear los datos
    useEffect(() => {
        console.log('Sales data:', sales);
        console.log('Currency symbol:', currencySymbol);
        console.log('Items value:', itemsValue);
    }, [sales, currencySymbol, itemsValue]);

    const columns = [
        {
            name: getFormattedMessage("globally.detail.reference"),
            sortField: "reference_code",
            sortable: false,
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
            name: getFormattedMessage("users.table.user.column.title"),
            selector: (row) => row.user_name,
            sortField: "user_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("customer.title"),
            selector: (row) => row.customer_name,
            sortField: "customer_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("warehouse.title"),
            selector: (row) => row.warehouse_name,
            sortField: "warehouse_name",
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
                                    "status.filter.complated.label"
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
            name: getFormattedMessage("globally.detail.paid"),
            sortField: "paid_amount",
            cell: (row) => {
                return row.reference_code === "Total" ? (
                    <span className="fw-bold fs-4">
                        {currencySymbolHandling(
                            allConfigData,
                            row.currency,
                            row.paid_amount
                        )}
                    </span>
                ) : (
                    <span>
                        {currencySymbolHandling(
                            allConfigData,
                            row.currency,
                            row.paid_amount
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
                        goToEditProduct={goToEdit}
                        isEditMode={true}
                        isPdfIcon={true}
                        onClickDeleteModel={onClickDeleteModel}
                        onPdfClick={onPdfClick}
                        title={getFormattedMessage("sale.title")}
                        isPaymentShow={true}
                        isCreatePayment={true}
                        isViewIcon={true}
                        goToDetailScreen={goToDetailScreen}
                        onShowPaymentClick={onShowPaymentClick}
                        isCreateSaleReturn={true}
                        onCreatePaymentClick={onCreatePaymentClick}
                        onCreateSaleReturnClick={onCreateSaleReturnClick}
                    />
                ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("sales.title")} />
            <div className="sale_table">
                <ReactDataTable
                    columns={columns}
                    items={tableArray}
                    to="#/user/sales/create"
                    buttonValue={getFormattedMessage("sale.create.title")}
                    isShowPaymentModel={isShowPaymentModel}
                    isCallSaleApi={isCallSaleApi}
                    isShowDateRangeField
                    onChange={onChange}
                    totalRows={totalRecord}
                    goToEdit={goToEdit}
                    isLoading={isLoading}
                    isShowFilterField
                    isPaymentStatus
                    isStatus
                    isPaymentType
                    isCallFetchDataApi={isCallFetchDataApi}
                />
            </div>
            <DeleteSale
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
            <ShowPayment
                setIsShowPaymentModel={setIsShowPaymentModel}
                currencySymbol={currencySymbol}
                allSalePayments={allSalePayments}
                createPaymentItem={createPaymentItem}
                onShowPaymentClick={onShowPaymentClick}
                isShowPaymentModel={isShowPaymentModel}
            />
            <ShowPayment
                allConfigData={allConfigData}
                setIsShowPaymentModel={setIsShowPaymentModel}
                currencySymbol={currencySymbol}
                allSalePayments={allSalePayments}
                createPaymentItem={createPaymentItem}
                onShowPaymentClick={onShowPaymentClick}
                isShowPaymentModel={isShowPaymentModel}
            />
            <CreatePaymentModal
                setIsCreatePaymentOpen={setIsCreatePaymentOpen}
                onCreatePaymentClick={onCreatePaymentClick}
                isCreatePaymentOpen={isCreatePaymentOpen}
                createPaymentItem={createPaymentItem}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {
        sales,
        totalRecord,
        isLoading,
        frontSetting,
        isCallSaleApi,
        allConfigData,
        isCallFetchDataApi
    } = state;
    return {
        sales,
        totalRecord,
        isLoading,
        frontSetting,
        isCallSaleApi,
        allConfigData,
        isCallFetchDataApi
    };
};

export default connect(mapStateToProps, {
    fetchSales,
    salePdfAction,
    fetchFrontSetting,
})(Sales);
