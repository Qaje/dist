import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faShoppingCart,
    faCartPlus,
    faArrowRight,
    faArrowLeft,
    faDollar,
    faSquareMinus,
    faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { todaySalePurchaseCount } from "../../store/action/dashboardAction";
import Widget from "../../shared/Widget/Widget";
import { useNavigate } from "react-router-dom";
import { fetchAllSalePurchaseCount } from "../../store/action/allSalePurchaseAction";
import DateRangePicker from "../../shared/datepicker/DateRangePicker";
import { dateFormat } from "../../constants";
import moment from "moment";

const TodaySalePurchaseCount = (props) => {
    const {
        todaySalePurchaseCount,
        todayCount,
        frontSetting,
        config,
        allSalePurchase,
        fetchAllSalePurchaseCount,
        allConfigData,
    } = props;
    const navigate = useNavigate();

    const [selectDate, setSelectDate] = useState();
    const startMonth = moment().locale("en").startOf("month").format(dateFormat.NATIVE);
    const today = moment().locale("en").format(dateFormat.NATIVE);

    useEffect(() => {
        todaySalePurchaseCount();
    }, []);

    useEffect(() => {
        onChangeDidMount();
    }, [selectDate]);

    const onChange = (filter) => {
        fetchAllSalePurchaseCount(filter);
    };

    const onDateSelector = (date) => {
        setSelectDate(date.params);
    };

    const onChangeDidMount = () => {
        const filters = {
            search: "",
            start_date: selectDate == undefined ? startMonth : selectDate.start_date ? selectDate.start_date : "",
            end_date: selectDate == undefined ? today : selectDate.end_date ? selectDate.end_date : "",
        };
        onChange(filters);
    };

    const onClick = (redirect, permission) => {
        if (
            config &&
            config.filter((item) => item === permission).length !== 0
        ) {
            navigate(`/${redirect}`);
        }
    };

    return (
    <>
        <div className="d-flex justify-content-end">
            <DateRangePicker
                onDateSelector={onDateSelector}
                selectDate={selectDate}
                isProfitReport={true}
            />
        </div>
        <Row className="g-4">
            <Col className="col-12 mb-4">
                <Row>
                    <Widget
                        title={getFormattedMessage("sales.title")}
                        onClick={() => onClick("user/sales", "manage_sale")}
                        allConfigData={allConfigData}
                        className={`bg-primary ${
                            config &&
                            config.filter((item) => item === "manage_sale")
                                .length !== 0
                                ? "cursor-pointer"
                                : ""
                        }`}
                        iconClass="bg-cyan-300"
                        icon={
                            <FontAwesomeIcon
                                icon={faShoppingCart}
                                className="fs-1-xl text-white"
                            />
                        }
                        currency={frontSetting?.value?.currency_symbol ?? ""}
                        value={
                            allSalePurchase.all_sales_count
                                ? parseFloat(
                                      allSalePurchase.all_sales_count
                                  ).toFixed(2)
                                : "0.00"
                        }
                    />

                    <Widget
                        title={getFormattedMessage("purchases.title")}
                        allConfigData={allConfigData}
                        onClick={() =>
                            onClick("user/purchases", "manage_purchase")
                        }
                        className={`bg-success ${
                            config &&
                            config.filter((item) => item === "manage_purchase")
                                .length !== 0
                                ? "cursor-pointer"
                                : ""
                        }`}
                        iconClass="bg-green-300"
                        icon={
                            <FontAwesomeIcon
                                icon={faCartPlus}
                                className="fs-1-xl text-white"
                            />
                        }
                        currency={frontSetting?.value?.currency_symbol ?? ""}
                        value={
                            allSalePurchase.all_purchases_count
                                ? parseFloat(
                                      allSalePurchase.all_purchases_count
                                  ).toFixed(2)
                                : "0.00"
                        }
                    />
                    <Widget
                        title={getFormattedMessage("sales-return.title")}
                        allConfigData={allConfigData}
                        onClick={() =>
                            onClick("user/sale-return", "manage_sale_return")
                        }
                        className={`bg-info ${
                            config &&
                            config.filter(
                                (item) => item === "manage_sale_return"
                            ).length !== 0
                                ? "cursor-pointer"
                                : ""
                        }`}
                        iconClass="bg-blue-300"
                        icon={
                            <FontAwesomeIcon
                                icon={faArrowRight}
                                className="fs-1-xl text-white"
                            />
                        }
                        currency={frontSetting?.value?.currency_symbol ?? ""}
                        value={
                            allSalePurchase.all_sale_return_count
                                ? parseFloat(
                                      allSalePurchase.all_sale_return_count
                                  ).toFixed(2)
                                : "0.00"
                        }
                    />

                    <Widget
                        title={getFormattedMessage("purchases.return.title")}
                        allConfigData={allConfigData}
                        onClick={() =>
                            onClick(
                                "user/purchase-return",
                                "manage_purchase_return"
                            )
                        }
                        className={`bg-warning ${
                            config &&
                            config.filter(
                                (item) => item === "manage_purchase_return"
                            ).length !== 0
                                ? "cursor-pointer"
                                : ""
                        }`}
                        iconClass="bg-yellow-300"
                        icon={
                            <FontAwesomeIcon
                                icon={faArrowLeft}
                                className="fs-1-xl text-white"
                            />
                        }
                        currency={frontSetting?.value?.currency_symbol ?? ""}
                        value={
                            allSalePurchase.all_purchase_return_count
                                ? parseFloat(
                                      allSalePurchase.all_purchase_return_count
                                  ).toFixed(2)
                                : "0.00"
                        }
                    />

                    <Widget
                        title={getFormattedMessage(
                            "dashboard.widget.today-total-sales.label"
                        )}
                        allConfigData={allConfigData}
                        onClick={() => onClick("user/sales", "manage_sale")}
                        className="widget-bg-purple  cursor-pointer"
                        iconClass="bg-purple-700"
                        icon={
                            <FontAwesomeIcon
                                icon={faDollar}
                                className="fs-1-xl text-white"
                            />
                        }
                        currency={frontSetting?.value?.currency_symbol ?? ""}
                        value={
                            todayCount.today_sales
                                ? parseFloat(todayCount.today_sales).toFixed(2)
                                : "0.00"
                        }
                    />

                    <Widget
                        title={getFormattedMessage(
                            "dashboard.widget.today-payment-received.label"
                        )}
                        allConfigData={allConfigData}
                        onClick={() => onClick("user/sales", "manage_sale")}
                        className="widget-bg-pink cursor-pointer"
                        iconClass="bg-pink-700"
                        icon={
                            <FontAwesomeIcon
                                icon={faMoneyBill}
                                className="fs-1-xl text-white"
                            />
                        }
                        currency={frontSetting?.value?.currency_symbol ?? ""}
                        value={
                            todayCount.today_sales_received_count
                                ? parseFloat(
                                      todayCount.today_sales_received_count
                                  ).toFixed(2)
                                : "0.00"
                        }
                    />

                    <Widget
                        title={getFormattedMessage(
                            "dashboard.widget.today-total-purchases.label"
                        )}
                        allConfigData={allConfigData}
                        onClick={() =>
                            onClick("user/purchases", "manage_purchase")
                        }
                        className="widget-bg-blue cursor-pointer"
                        iconClass="widget-bg-blue-700 "
                        icon={
                            <FontAwesomeIcon
                                icon={faCartPlus}
                                className="fs-1-xl text-white"
                            />
                        }
                        currency={frontSetting?.value?.currency_symbol ?? ""}
                        value={
                            todayCount.today_purchases
                                ? parseFloat(
                                      todayCount.today_purchases
                                  ).toFixed(2)
                                : "0.00"
                        }
                    />

                    <Widget
                        title={getFormattedMessage(
                            "dashboard.widget.today-total-expense.label"
                        )}
                        allConfigData={allConfigData}
                        onClick={() =>
                            onClick("user/expenses", "manage_expenses")
                        }
                        className="widget-bg-red cursor-pointer"
                        iconClass="bg-red-300"
                        icon={
                            <FontAwesomeIcon
                                icon={faSquareMinus}
                                className="fs-1-xl text-white"
                            />
                        }
                        currency={frontSetting?.value?.currency_symbol ?? ""}
                        value={
                            todayCount.today_expense_count
                                ? parseFloat(
                                      todayCount.today_expense_count
                                  ).toFixed(2)
                                : "0.00"
                        }
                    />
                </Row>
            </Col>
        </Row>
    </>
    );
};
const mapStateToProps = (state) => {
    const { todayCount, allSalePurchase, config, allConfigData } = state;
    return { todayCount, allSalePurchase, config, allConfigData };
};

export default connect(mapStateToProps, {
    todaySalePurchaseCount,
    fetchAllSalePurchaseCount,
})(TodaySalePurchaseCount);
