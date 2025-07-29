import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row, Table, Nav } from "react-bootstrap-v5";
import { connect, useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import Category from "./Category";
import Brands from "./Brand";
import Product from "./product/Product";
import Assistance from "./assistance/Assistance"; // Nuevo componente
import AssistanceCategory from "./assistance/AssistanceCategory"; // Nuevo componente
import ProductCartList from "./cart-product/ProductCartList";
import {
    posSearchNameProduct,
    posSearchCodeProduct,
} from "../../store/action/pos/posfetchProductAction";
import {
    fetchAssistanceClickable, posAllAssistance
} from "../../store/action/pos/posAllAssistanceAction"; // Nueva acción
import ProductSearchbar from "./product/ProductSearchbar";
import AssistanceSearchbar from "./assistance/AssistanceSearchbar"; // Nuevo componente
import { prepareCartArray } from "../shared/PrepareCartArray";
import { prepareMixedCartArray } from "../shared/PrepareCartAssistanceArray"; // Nueva función
import ProductDetailsModel from "../shared/ProductDetailsModel";
import CartItemMainCalculation from "./cart-product/CartItemMainCalculation";
import PosHeader from "./header/PosHeader";
import { posCashPaymentAction } from "../../store/action/pos/posCashPaymentAction";
import PaymentButton from "./cart-product/PaymentButton";
import CashPaymentModel from "./cart-product/paymentModel/CashPaymentModel";
import PrintData from "./printModal/PrintData";
import PaymentSlipModal from "./paymentSlipModal/PaymentSlipModal";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import { fetchSetting } from "../../store/action/settingAction";
import { calculateProductCost } from "../shared/SharedMethod";
import {
    fetchBrandClickable,
    posAllProduct,
} from "../../store/action/pos/posAllProductAction";
import TabTitle from "../../shared/tab-title/TabTitle";
import HeaderAllButton from "./header/HeaderAllButton";
import RegisterDetailsModel from "./register-detailsModal/RegisterDetailsModel";
import PrintRegisterDetailsData from "./printModal/PrintRegisterDetailsData";
import {
    closeRegisterAction,
    fetchTodaySaleOverAllReport,
    getAllRegisterDetailsAction,
} from "../../store/action/pos/posRegisterDetailsAction";
import {
    getFormattedMessage,
    getFormattedOptions,
} from "../../shared/sharedMethod";
import { discountType, paymentMethodOptions, productActionType, assistanceActionType, asistancesActionType, toastType } from "../../constants";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import CustomerForm from "./customerModel/CustomerForm";
import HoldListModal from "./holdListModal/HoldListModal";
import { fetchHoldLists } from "../../store/action/pos/HoldListAction";
import { useNavigate } from "react-router";
import PosCloseRegisterDetailsModel from "../../components/posRegister/PosCloseRegisterDetailsModel.js";
import { addToast } from "../../store/action/toastAction";
import PosRegisterModel from "../../components/posRegister/PosRegisterModel.js";
import { fetchTax } from "../../store/action/taxAction.js";
import { setCartProduct } from "../../store/action/cartAction.js";

const PosMainPage = (props) => {
    const {
        onClickFullScreen,
        posAllProducts,
        posAllAssistances, // Nueva prop
        customCart,
        posCashPaymentAction,
        frontSetting,
        fetchFrontSetting,
        settings,
        fetchSetting,
        paymentDetails,
        allConfigData,
        fetchBrandClickable,
        fetchAssistanceClickable, // Nueva prop
        posAllTodaySaleOverAllReport,
        fetchHoldLists,
        holdListData,
        taxes
    } = props;

    const componentRef = useRef();
    const registerDetailsRef = useRef();
    const [openCalculator, setOpenCalculator] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [updateProducts, setUpdateProducts] = useState([]);
    const [isOpenCartItemUpdateModel, setIsOpenCartItemUpdateModel] = useState(false);
    const [product, setProduct] = useState(null);
    const [cartProductIds, setCartProductIds] = useState([]);
    const [cartAssistanceIds, setCartAssistanceIds] = useState([]); // Nuevo estado
    const [newCost, setNewCost] = useState("");
    const [paymentPrint, setPaymentPrint] = useState({});
    const [cashPayment, setCashPayment] = useState(false);
    const [modalShowPaymentSlip, setModalShowPaymentSlip] = useState(false);
    const [modalShowCustomer, setModalShowCustomer] = useState(false);
    const [productMsg, setProductMsg] = useState(0);
    const [brandId, setBrandId] = useState();
    const [categoryId, setCategoryId] = useState();
    const [assistanceCategoryId, setAssistanceCategoryId] = useState(); // Nuevo estado
    const [selectedCustomerOption, setSelectedCustomerOption] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [updateHolList, setUpdateHoldList] = useState(false);
    const [hold_ref_no, setHold_ref_no] = useState("");
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState('products'); // Nuevo estado para tabs

    const [cartItemValue, setCartItemValue] = useState({
        discount_type: discountType.FIXED,
        discount_value: 0,
        discount: 0,
        tax: 0,
        shipping: 0,
    });

    const [cashPaymentValue, setCashPaymentValue] = useState({
        notes: "",
        payment_status: {
            label: getFormattedMessage("globally.detail.paid"),
            value: 1,
        },
    });

    const [errors, setErrors] = useState({ notes: "" });
    const [changeReturn, setChangeReturn] = useState(0);
    const [showCloseDetailsModal, setShowCloseDetailsModal] = useState(false);
    const [showPosRegisterModel, setShowPosRegisterModel] = useState(false);

    const { closeRegisterDetails } = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Cálculos del carrito (modificados para soportar productos y asistencias)
    const localCart = updateProducts.map((updateQty) => Number(updateQty.quantity));
    const totalQty = localCart.length > 0 && Number(localCart?.reduce((cart, current) => cart + current, 0)).toFixed(2);

    const localTotal = updateProducts.map((item) => {
        if (item.item_type === 'assistance') {
            return item.attributes?.price * item.quantity || item.price * item.quantity;
        } else {
            return calculateProductCost(item).toFixed(2) * item.quantity;
        }
    });

    const subTotal = localTotal.length > 0 && localTotal?.reduce((cart, current) => cart + current, 0);

    const [holdListId, setHoldListValue] = useState({
        referenceNumber: "",
    });

    const discountTotal = subTotal - cartItemValue.discount;
    const taxTotal = (discountTotal * cartItemValue.tax) / 100;
    const mainTotal = discountTotal + taxTotal;
    const grandTotal = (Number(mainTotal) + Number(cartItemValue.shipping)).toFixed(2);

    useEffect(() => {
        setPaymentPrint({
            ...paymentPrint,
            barcode_url: paymentDetails.attributes && paymentDetails.attributes.barcode_url,
            reference_code: paymentDetails.attributes && paymentDetails.attributes.reference_code,
        });
    }, [paymentDetails]);

    useEffect(() => {
        setSelectedCustomerOption(
            settings.attributes && {
                value: Number(settings.attributes.default_customer),
                label: settings.attributes.customer_name,
            }
        );
        setSelectedOption(
            settings.attributes && {
                value: Number(settings.attributes.default_warehouse),
                label: settings.attributes.warehouse_name,
            }
        );
    }, [settings]);

    useEffect(() => {
        fetchSetting();
        fetchFrontSetting();
        fetchTodaySaleOverAllReport();
        fetchHoldLists();
    }, []);

    useEffect(() => {
        if (allConfigData) {
            setShowPosRegisterModel(allConfigData?.open_register);
        }
    }, [allConfigData]);

    useEffect(() => {
        if (updateHolList === true) {
            fetchHoldLists();
            setUpdateHoldList(false);
        }
    }, [updateHolList]);

    useEffect(() => {
        setUpdateProducts(updateProducts);
    }, [quantity, grandTotal]);

    const handleValidation = () => {
        let errors = {};
        let isValid = false;
        if (cashPaymentValue["notes"] && cashPaymentValue["notes"].length > 100) {
            errors["notes"] = "The notes must not be greater than 100 characters";
        } else {
            isValid = true;
        }
        setErrors(errors);
        return isValid;
    };

    // Filtros de categoría para productos
    const setCategory = (item) => {
        setCategoryId(item);
    };

    // Filtros de categoría para asistencias
    const setAssistanceCategory = (item) => {
        setAssistanceCategoryId(item);
    };

    useEffect(() => {
        if (selectedOption) {
            if (activeTab === 'products') {
                dispatch({ type: productActionType.RESET_PRODUCT });
                setPage(1);
                fetchBrandClickable(brandId, categoryId, selectedOption.value && selectedOption.value, 1, "", true);
            } else if (activeTab === 'assistances') {
                // Corregir el tipo de acción
                dispatch({ type: asistancesActionType.RESET_ASSISTANCE });
                setPage(1);
                // Llamar con resetPage=true para limpiar la lista
                fetchAssistanceClickable(assistanceCategoryId, selectedOption.value && selectedOption.value, 1, "", true);
            }
        }
    }, [selectedOption, brandId, categoryId, assistanceCategoryId, activeTab]);

    useEffect(() => {
        if (activeTab === 'assistances' && selectedOption) {
            // Cargar todas las asistencias para el dropdown/lista completa
            dispatch(posAllAssistance({
                warehouse_id: selectedOption.value
            }));
        }
    }, [activeTab, selectedOption]);

    useEffect(() => {
        if (activeTab === 'assistances-category' && selectedOption) {
            // Cargar todas las asistencias para el dropdown/lista completa
            dispatch(posAllAssistance({
                warehouse_id: selectedOption.value
            }));
        }
    }, [activeTab, selectedOption]);


    const setBrand = (item) => {
        setBrandId(item);
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setCashPaymentValue((inputs) => ({
            ...inputs,
            [e.target.name]: e.target.value,
        }));
    };

    const onPaymentStatusChange = (obj) => {
        setCashPaymentValue((inputs) => ({ ...inputs, payment_status: obj }));
    };

    const onChangeReturnChange = (change) => {
        setChangeReturn(change);
    };

    const paymentTypeFilterOptions = getFormattedOptions(paymentMethodOptions);
    const paymentTypeDefaultValue = paymentTypeFilterOptions.map((option) => {
        return {
            value: option.id,
            label: option.name,
        };
    });

    const [paymentValue, setPaymentValue] = useState({
        payment_type: paymentTypeDefaultValue[0],
    });

    const onPaymentTypeChange = (obj) => {
        setPaymentValue({ ...paymentValue, payment_type: obj });
    };

    useEffect(() => {
        const newCartData = {
            cartProduct: updateProducts,
            customer: selectedCustomerOption,
            cartItemValue: cartItemValue,
            subTotal: Number(subTotal),
            grandTotal: Number(grandTotal),
            paymentMethod: paymentValue?.payment_type,
        };
        dispatch(setCartProduct(newCartData));
        localStorage.setItem('cart-sync', JSON.stringify(newCartData));
    }, [updateProducts, selectedCustomerOption, selectedOption, cartItemValue, subTotal, grandTotal, cashPaymentValue, paymentValue]);

    const onChangeCart = (event) => {
        if (updateProducts.length == 0) {
            dispatch(addToast({ text: getFormattedMessage("pos.cash-payment.product-error.message"), type: toastType.ERROR }));
            return;
        }
        const { value } = event.target;
        if (value.match(/\./g)) {
            const [, decimal] = value.split(".");
            if (decimal?.length > 2) {
                return;
            }
        }

        let discount = cartItemValue.discount;
        if (event.target.name == 'discount_value') {
            if (cartItemValue.discount_type == discountType.FIXED) {
                discount = value;
            } else {
                discount = (Number(subTotal) * Number(value)) / 100;
            }
        }
        if (event.target.name === 'discount_type') {
            if (value == discountType.FIXED) {
                discount = cartItemValue.discount_value;
            } else {
                discount = (Number(subTotal) * Number(cartItemValue.discount_value)) / 100;
            }
        }

        setCartItemValue((inputs) => ({
            ...inputs,
            discount: discount,
            [event.target.name]: value,
        }));
    };

    const onChangeTaxCart = (event) => {
        if (updateProducts.length == 0) {
            dispatch(addToast({ text: getFormattedMessage("pos.cash-payment.product-error.message"), type: toastType.ERROR }));
            return;
        }
        const min = 0;
        const max = 100;
        const { value } = event.target;
        const values = Math.max(min, Math.min(max, Number(value)));
        if (value.match(/\./g)) {
            const [, decimal] = value.split(".");
            if (decimal?.length > 2) {
                return;
            }
        }
        setCartItemValue((inputs) => ({
            ...inputs,
            [event.target.name]: values,
        }));
    };

    const handleCashPayment = () => {
        setCashPaymentValue({
            notes: "",
            payment_status: {
                label: getFormattedMessage("globally.detail.paid"),
                value: 1,
            },
        });
        setCashPayment(!cashPayment);
    };

    const updateCost = (item) => {
        setNewCost(item);
    };

    const openProductDetailModal = () => {
        setIsOpenCartItemUpdateModel(!isOpenCartItemUpdateModel);
    };

    const onClickUpdateItemInCart = (item) => {
        setProduct(item);
        setIsOpenCartItemUpdateModel(true);
    };

    const onProductUpdateInCart = () => {
        const localCart = updateProducts.slice();
        updateCart(localCart);
    };

    const updatedQty = (qty) => {
        setQuantity(qty);
    };

    const updateCart = (cartProducts) => {
        setUpdateProducts(cartProducts);
    };

    const onDeleteCartItem = (itemId, itemType = 'product') => {
        const existingCart = updateProducts.filter((e) => !(e.id === itemId && (e.item_type === itemType || (!e.item_type && itemType === 'product'))));
        updateCart(existingCart);
    };

    const addToCarts = (items) => {
        updateCart(items);
    };

    const onScrollCallAPI = (page) => {
        if (activeTab === 'products') {
            fetchBrandClickable(brandId, categoryId, selectedOption.value && selectedOption.value, page);
        } else if (activeTab === 'assistances') {
            // Pasar todos los parámetros necesarios
            fetchAssistanceClickable(
                assistanceCategoryId,
                selectedOption.value && selectedOption.value,
                page,
                "", // search string vacío
                false // resetPage = false para paginación
            );
        }
    };


    const onSearchProduct = (search) => {
        fetchBrandClickable(brandId, categoryId, selectedOption.value && selectedOption.value, 1, search, true);
    };

    // const onSearchAssistance = (search) => {
    //     fetchAssistanceClickable(assistanceCategoryId, selectedOption.value && selectedOption.value, 1, search, true);
    // };
    const onSearchAssistance = (search) => {
        dispatch({ type: asistancesActionType.RESET_ASSISTANCE });
        setPage(1);
        fetchAssistanceClickable(
            assistanceCategoryId,
            selectedOption.value && selectedOption.value,
            1,
            search,
            true // resetPage = true para nueva búsqueda
        );
    };

    const handleTabChange = (tab) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            setPage(1);

            if (tab === 'products') {
                // Limpiar filtros de asistencias
                setAssistanceCategoryId(null);
            } else if (tab === 'assistances') {
                // Limpiar filtros de productos
                setBrandId(null);
                setCategoryId(null);
            }
        }
    };

    const customerModel = (val) => {
        setModalShowCustomer(val);
    };

    const preparePrintData = () => {
        const formValue = {
            products: updateProducts,
            discount: cartItemValue.discount ? cartItemValue.discount : 0,
            tax: cartItemValue.tax ? cartItemValue.tax : 0,
            cartItemPrint: cartItemValue,
            taxTotal: taxTotal,
            grandTotal: grandTotal,
            shipping: cartItemValue.shipping,
            subTotal: subTotal,
            frontSetting: frontSetting,
            customer_name: selectedCustomerOption,
            settings: settings,
            note: cashPaymentValue.notes,
            changeReturn,
            payment_status: cashPaymentValue.payment_status,
        };
        return formValue;
    };

    const prepareData = (updateProducts) => {
        const formValue = {
            date: moment(new Date()).format("YYYY-MM-DD"),
            customer_id: selectedCustomerOption && selectedCustomerOption[0]
                ? selectedCustomerOption[0].value
                : selectedCustomerOption && selectedCustomerOption.value,
            warehouse_id: selectedOption && selectedOption[0]
                ? selectedOption[0].value
                : selectedOption && selectedOption.value,
            sale_items: updateProducts,
            grand_total: grandTotal,
            ...(cashPaymentValue?.payment_status?.value === 1
                ? { payment_type: paymentValue?.payment_type?.value }
                : {}),
            discount: cartItemValue.discount,
            shipping: cartItemValue.shipping,
            tax_rate: cartItemValue.tax,
            note: cashPaymentValue.notes,
            status: 1,
            hold_ref_no: hold_ref_no,
            payment_status: cashPaymentValue?.payment_status?.value,
        };
        return formValue;
    };

    const onCashPayment = (event, printSlip = false) => {
        event.preventDefault();
        const valid = handleValidation();
        if (valid) {
            posCashPaymentAction(
                prepareData(updateProducts),
                setUpdateProducts,
                printSlip && setModalShowPaymentSlip,
                {
                    brandId,
                    categoryId,
                    assistanceCategoryId,
                    selectedOption,
                },
                printSlip
            );
            setCashPayment(false);
            setPaymentPrint(preparePrintData);
            setCartItemValue({
                discount_type: discountType.FIXED,
                discount_value: 0,
                discount: 0,
                tax: 0,
                shipping: 0,
            });
            setCashPaymentValue({
                notes: "",
                payment_status: {
                    label: getFormattedMessage("globally.detail.paid"),
                    value: 1,
                },
            });
            dispatch(fetchTax());
            setCartProductIds("");
            setCartAssistanceIds(""); // Limpiar IDs de assistances
        }
    };

    const printPaymentReceiptPdf = () => {
        document.getElementById("printReceipt").click();
    };

    const printRegisterDetails = () => {
        document.getElementById("printRegisterDetailsId").click();
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handleRegisterDetailsPrint = useReactToPrint({
        content: () => registerDetailsRef.current,
    });

    const loadPrintBlock = () => {
        return (
            <div className="d-none">
                <button id="printReceipt" onClick={handlePrint}>
                    Print this out!
                </button>
                <PrintData
                    ref={componentRef}
                    paymentType={paymentValue.payment_type.label}
                    paymentTypeOption={paymentValue.payment_type.value}
                    allConfigData={allConfigData}
                    updateProducts={paymentPrint}
                    frontSetting={frontSetting}
                    settings={settings}
                    taxes={taxes}
                />
            </div>
        );
    };

    const loadRegisterDetailsPrint = () => {
        return (
            <div className="d-none">
                <button id="printRegisterDetailsId" onClick={handleRegisterDetailsPrint}>
                    Print this out!
                </button>
                <PrintRegisterDetailsData
                    ref={registerDetailsRef}
                    allConfigData={allConfigData}
                    frontSetting={frontSetting}
                    posAllTodaySaleOverAllReport={posAllTodaySaleOverAllReport}
                    updateProducts={paymentPrint}
                    closeRegisterDetails={closeRegisterDetails}
                />
            </div>
        );
    };

    const loadPaymentSlip = () => {
        return (
            <div className="d-none">
                <PaymentSlipModal
                    printPaymentReceiptPdf={printPaymentReceiptPdf}
                    setPaymentValue={setPaymentValue}
                    setModalShowPaymentSlip={setModalShowPaymentSlip}
                    settings={settings}
                    frontSetting={frontSetting}
                    modalShowPaymentSlip={modalShowPaymentSlip}
                    allConfigData={allConfigData}
                    paymentDetails={paymentDetails}
                    updateProducts={paymentPrint}
                    paymentType={paymentValue.payment_type.label}
                    paymentTypeOption={paymentValue.payment_type.value}
                    paymentTypeDefaultValue={paymentTypeDefaultValue}
                    taxes={taxes}
                />
            </div>
        );
    };

    const [lgShow, setLgShow] = useState(false);
    const [holdShow, setHoldShow] = useState(false);

    const onClickDetailsModel = (isDetails = null) => {
        setLgShow(true);
    };

    const onClickHoldModel = (isDetails = null) => {
        setHoldShow(true);
    };

    const handleClickCloseRegister = () => {
        dispatch(getAllRegisterDetailsAction());
        setShowCloseDetailsModal(true);
    };

    const handleCloseRegisterDetails = (data) => {
        if (data.cash_in_hand_while_closing.toString().trim()?.length === 0) {
            dispatch(
                addToast({
                    text: getFormattedMessage("pos.cclose-register.enter-total-cash.message"),
                    type: toastType.ERROR,
                })
            );
        } else {
            setShowCloseDetailsModal(false);
            dispatch(closeRegisterAction(data, navigate));
        }
    };

    const debugAssistanceCall = () => {
        console.log('Debug - Assistance Call Parameters:', {
            assistanceCategoryId,
            warehouseId: selectedOption?.value,
            page,
            activeTab,
            selectedOption
        });
    };

    return (
        <Container className="pos-screen px-3" fluid>
            <TabTitle title="POS" />
            {loadPrintBlock()}
            {loadPaymentSlip()}
            {loadRegisterDetailsPrint()}
            <Row>
                <TopProgressBar />
                <Col lg={5} xxl={4} xs={6} className="pos-left-scs">
                    <div className="d-flex flex-column h-100">
                        <PosHeader
                            setSelectedCustomerOption={setSelectedCustomerOption}
                            selectedCustomerOption={selectedCustomerOption}
                            setSelectedOption={setSelectedOption}
                            selectedOption={selectedOption}
                            customerModel={customerModel}
                            updateCustomer={modalShowCustomer}
                        />
                        <div className="left-content custom-card mb-3 p-3 d-flex flex-column justify-content-between">
                            <div className="main-table overflow-auto">
                                <Table className="mb-0">
                                    <thead className="position-sticky top-0">
                                        <tr>
                                            <th>{getFormattedMessage("product.title")}</th>
                                            <th className={updateProducts && updateProducts.length ? "text-center" : ""}>
                                                {getFormattedMessage("pos-qty.title")}
                                            </th>
                                            <th>{getFormattedMessage("price.title")}</th>
                                            <th colSpan="2">{getFormattedMessage("pos.subtotal.small.title")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="border-0">
                                        {updateProducts && updateProducts.length ? (
                                            updateProducts.map((updateProduct, index) => {
                                                return (
                                                    <ProductCartList
                                                        singleProduct={updateProduct}
                                                        key={`${updateProduct.item_type || 'product'}-${updateProduct.id}-${index}`}
                                                        index={index}
                                                        posAllProducts={posAllProducts}
                                                        onClickUpdateItemInCart={onClickUpdateItemInCart}
                                                        updatedQty={updatedQty}
                                                        updateCost={updateCost}
                                                        onDeleteCartItem={onDeleteCartItem}
                                                        quantity={quantity}
                                                        frontSetting={frontSetting}
                                                        newCost={newCost}
                                                        allConfigData={allConfigData}
                                                        setUpdateProducts={setUpdateProducts}
                                                    />
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="custom-text-center text-gray-900 fw-bold py-5">
                                                    {getFormattedMessage("sale.product.table.no-data.label")}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                            <div>
                                <CartItemMainCalculation
                                    totalQty={totalQty}
                                    subTotal={subTotal}
                                    grandTotal={grandTotal}
                                    cartItemValue={cartItemValue}
                                    onChangeCart={onChangeCart}
                                    allConfigData={allConfigData}
                                    frontSetting={frontSetting}
                                    onChangeTaxCart={onChangeTaxCart}
                                />
                                <PaymentButton
                                    updateProducts={updateProducts}
                                    updateCart={addToCarts}
                                    setUpdateProducts={setUpdateProducts}
                                    setCartItemValue={setCartItemValue}
                                    setCashPayment={setCashPayment}
                                    cartItemValue={cartItemValue}
                                    grandTotal={grandTotal}
                                    subTotal={subTotal}
                                    selectedOption={selectedOption}
                                    cashPaymentValue={cashPaymentValue}
                                    holdListId={holdListId}
                                    setHoldListValue={setHoldListValue}
                                    selectedCustomerOption={selectedCustomerOption}
                                    setUpdateHoldList={setUpdateHoldList}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
                <Col lg={7} xxl={8} xs={6} className="ps-lg-0 pos-right-scs">
                    <div className="right-content mb-3 d-flex flex-column h-100">
                        <div className="d-sm-flex align-items-center flex-xxl-nowrap flex-wrap">
                            {activeTab === 'products' ? (
                                <ProductSearchbar
                                    customCart={customCart}
                                    setUpdateProducts={setUpdateProducts}
                                    updateProducts={updateProducts}
                                    selectedOption={selectedOption}
                                    onSearchProduct={onSearchProduct}
                                    settings={settings}
                                />
                            ) : (
                                <AssistanceSearchbar
                                    customCart={customCart}
                                    setUpdateProducts={setUpdateProducts}
                                    updateProducts={updateProducts}
                                    selectedOption={selectedOption}
                                    onSearchAssistance={onSearchAssistance}
                                    settings={settings}
                                />
                            )}
                            <HeaderAllButton
                                holdListData={holdListData}
                                goToHoldScreen={onClickHoldModel}
                                goToDetailScreen={onClickDetailsModel}
                                onClickFullScreen={onClickFullScreen}
                                opneCalculator={openCalculator}
                                setOpneCalculator={setOpenCalculator}
                                handleClickCloseRegister={handleClickCloseRegister}
                            />
                        </div>

                        {/* Tabs para alternar entre Productos y Asistencias */}
                        <Nav variant="tabs" className="mb-3">
                            <Nav.Item>
                                <Nav.Link
                                    active={activeTab === 'products'}
                                    onClick={() => handleTabChange('products')}
                                >
                                    {getFormattedMessage("pos.products.tab.title", ' ')}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                    active={activeTab === 'assistances'}
                                    onClick={() => handleTabChange('assistances')}
                                >
                                    {getFormattedMessage("pos.assistances.tab.title", ' ')}
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <div className="custom-card h-100 mb-3">
                            <div className="p-3">
                                {activeTab === 'products' ? (
                                    <>
                                        <Category
                                            setCategory={setCategory}
                                            brandId={brandId}
                                            selectedOption={selectedOption}
                                        />
                                        <Brands
                                            categoryId={categoryId}
                                            setBrand={setBrand}
                                            selectedOption={selectedOption}
                                        />
                                    </>
                                ) : (
                                    <AssistanceCategory
                                        setAssistanceCategory={setAssistanceCategory}
                                        selectedOption={selectedOption}
                                    />
                                )}
                            </div>

                            {activeTab === 'products' ? (
                                <Product
                                    cartProducts={updateProducts}
                                    updateCart={addToCarts}
                                    customCart={customCart}
                                    setCartProductIds={setCartProductIds}
                                    cartProductIds={cartProductIds}
                                    settings={settings}
                                    productMsg={productMsg}
                                    selectedOption={selectedOption}
                                    onScrollCallAPI={onScrollCallAPI}
                                    page={page}
                                    setPage={setPage}
                                />
                            ) : (
                                <Assistance
                                    cartProducts={updateProducts}
                                    updateCart={addToCarts}
                                    customCart={customCart}
                                    setCartAssistanceIds={setCartAssistanceIds}
                                    cartAssistanceIds={cartAssistanceIds}
                                    settings={settings}
                                    selectedOption={selectedOption}
                                    onScrollCallAPI={onScrollCallAPI}
                                    page={page}
                                    setPage={setPage}
                                />
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Modales existentes */}
            {isOpenCartItemUpdateModel && (
                <ProductDetailsModel
                    openProductDetailModal={openProductDetailModal}
                    productModelId={product.id}
                    onProductUpdateInCart={onProductUpdateInCart}
                    updateCost={updateCost}
                    cartProduct={product}
                    isOpenCartItemUpdateModel={isOpenCartItemUpdateModel}
                    frontSetting={frontSetting}
                />
            )}
            {cashPayment && (
                <CashPaymentModel
                    cashPayment={cashPayment}
                    totalQty={totalQty}
                    cartItemValue={cartItemValue}
                    onChangeInput={onChangeInput}
                    onPaymentStatusChange={onPaymentStatusChange}
                    cashPaymentValue={cashPaymentValue}
                    allConfigData={allConfigData}
                    subTotal={subTotal}
                    onPaymentTypeChange={onPaymentTypeChange}
                    grandTotal={grandTotal}
                    onCashPayment={onCashPayment}
                    taxTotal={taxTotal}
                    handleCashPayment={handleCashPayment}
                    settings={settings}
                    errors={errors}
                    paymentTypeDefaultValue={paymentTypeDefaultValue}
                    paymentTypeFilterOptions={paymentTypeFilterOptions}
                    onChangeReturnChange={onChangeReturnChange}
                    setPaymentValue={setPaymentValue}
                />
            )}
            {lgShow && (
                <RegisterDetailsModel
                    printRegisterDetails={printRegisterDetails}
                    frontSetting={frontSetting}
                    lgShow={lgShow}
                    setLgShow={setLgShow}
                />
            )}
            {holdShow && (
                <HoldListModal
                    setUpdateHoldList={setUpdateHoldList}
                    setCartItemValue={setCartItemValue}
                    setUpdateProducts={setUpdateProducts}
                    updateProduct={updateProducts}
                    printRegisterDetails={printRegisterDetails}
                    frontSetting={frontSetting}
                    holdListData={holdListData}
                    setHold_ref_no={setHold_ref_no}
                    holdShow={holdShow}
                    setHoldShow={setHoldShow}
                    addCart={addToCarts}
                    updateCart={updateCart}
                    setSelectedCustomerOption={setSelectedCustomerOption}
                    setSelectedOption={setSelectedOption}
                />
            )}
            {modalShowCustomer && (
                <CustomerForm
                    show={modalShowCustomer}
                    hide={setModalShowCustomer}
                    setSelectedCustomerOption={setSelectedCustomerOption}
                />
            )}
            <PosCloseRegisterDetailsModel
                showCloseDetailsModal={showCloseDetailsModal}
                handleCloseRegisterDetails={handleCloseRegisterDetails}
                setShowCloseDetailsModal={setShowCloseDetailsModal}
            />
            {allConfigData?.permissions?.length === 1 && (
                <PosRegisterModel
                    showPosRegisterModel={showPosRegisterModel}
                    isCloseButton={false}
                    onClickshowPosRegisterModel={() => setShowPosRegisterModel(false)}
                />
            )}
        </Container>
    );
};

const mapStateToProps = (state) => {
    const {
        posAllProducts,
        posAllAssistances, // Nueva prop del reducer
        frontSetting,
        settings,
        cashPayment,
        allConfigData,
        posAllTodaySaleOverAllReport,
        holdListData,
        taxes
    } = state;
    return {
        holdListData,
        posAllProducts,
        posAllAssistances, // Agregar assistances al estado
        frontSetting,
        settings,
        paymentDetails: cashPayment,
        customCart: prepareCartArray(posAllProducts),
        allConfigData,
        posAllTodaySaleOverAllReport,
        taxes
    };
};

export default connect(mapStateToProps, {
    fetchSetting,
    fetchFrontSetting,
    posSearchNameProduct,
    posCashPaymentAction,
    posSearchCodeProduct,
    posAllProduct,
    fetchBrandClickable,
    fetchAssistanceClickable, // Nueva acción
    fetchHoldLists,
})(PosMainPage);
