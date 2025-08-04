import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row, Table, Nav, Button } from "react-bootstrap-v5";
import { connect, useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import Category from "./Category";
import Brands from "./Brand";
import Product from "./product/Product";
import Assistance from "./assistance/Assistance";
import AssistanceCategory from "./assistance/AssistanceCategory";
import ProductCartList from "./cart-product/ProductCartList";
import {
    posSearchCodeProduct,
    posSearchNameProduct,
} from "../../store/action/pos/posfetchProductAction";
import {
    fetchAssistanceClickable,
    posAllAssistance
} from "../../store/action/pos/posAllAssistanceAction";
import ProductSearchbar from "./product/ProductSearchbar";
import AssistanceSearchbar from "./assistance/AssistanceSearchbar";
import { prepareCartArray } from "../shared/PrepareCartArray";
import { prepareMixedCartArray } from "../shared/PrepareCartAssistanceArray";
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
import {
    discountType,
    paymentMethodOptions,
    productActionType,
    assistanceActionType,
    asistancesActionType,
    toastType
} from "../../constants";
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
        posAllAssistances,
        customCart,
        posCashPaymentAction,
        frontSetting,
        fetchFrontSetting,
        settings,
        fetchSetting,
        paymentDetails,
        allConfigData,
        fetchBrandClickable,
        fetchAssistanceClickable,
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
    const [cartAssistanceIds, setCartAssistanceIds] = useState([]);
    const [newCost, setNewCost] = useState("");
    const [paymentPrint, setPaymentPrint] = useState({});
    const [cashPayment, setCashPayment] = useState(false);
    const [modalShowPaymentSlip, setModalShowPaymentSlip] = useState(false);
    const [modalShowCustomer, setModalShowCustomer] = useState(false);
    const [productMsg, setProductMsg] = useState(0);
    const [brandId, setBrandId] = useState();
    const [categoryId, setCategoryId] = useState();
    const [assistanceCategoryId, setAssistanceCategoryId] = useState();
    const [selectedCustomerOption, setSelectedCustomerOption] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [updateHolList, setUpdateHoldList] = useState(false);
    const [hold_ref_no, setHold_ref_no] = useState("");
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState('products');
    const [loading, setLoading] = useState(false);

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

    const calculateItemCost = (item) => {
        if (!item) return 0;

        console.log('Calculating cost for item:', item);

        if (item.item_type === 'assistance') {
            // Para asistencias, usar asistence_price
            const price = item.asistence_price ||
                item.attributes?.asistence_price ||
                item.price ||
                item.attributes?.price ||
                0;
            return Number(price);
        } else {
            // Para productos, usar product_price con fallbacks
            const price = item.product_price ||
                item.attributes?.product_price ||
                item.price ||
                item.attributes?.price ||
                item.fix_net_unit ||
                calculateProductCost(item) ||
                0;
            return Number(price);
        }
    };

    const calculateCartTotals = () => {
        if (!updateProducts || updateProducts.length === 0) {
            return {
                totalQty: '0.00',
                subTotal: 0
            };
        }

        const quantities = updateProducts.map(item => Number(item.quantity || 0));
        const totalQty = quantities.reduce((sum, qty) => sum + qty, 0).toFixed(2);

        const itemTotals = updateProducts.map(item => {
            const itemCost = calculateItemCost(item);
            const quantity = Number(item.quantity || 0);
            const total = itemCost * quantity;

            console.log(`Item: ${item.name}, Cost: ${itemCost}, Qty: ${quantity}, Total: ${total}`);
            return total;
        });

        const subTotal = itemTotals.reduce((sum, total) => sum + total, 0);

        return { totalQty, subTotal };
    };


    const [errors, setErrors] = useState({ notes: "" });
    const [changeReturn, setChangeReturn] = useState(0);
    const [showCloseDetailsModal, setShowCloseDetailsModal] = useState(false);
    const [showPosRegisterModel, setShowPosRegisterModel] = useState(false);

    const { closeRegisterDetails } = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { totalQty, subTotal } = calculateCartTotals();
    const discountTotal = subTotal - (cartItemValue.discount || 0);
    const taxTotal = (discountTotal * (cartItemValue.tax || 0)) / 100;
    const mainTotal = discountTotal + taxTotal;
    const grandTotal = (Number(mainTotal) + Number(cartItemValue.shipping || 0)).toFixed(2);



    const [holdListId, setHoldListValue] = useState({
        referenceNumber: "",
    });

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

    useEffect(() => {
        debugCartData();
    }, [updateProducts]);

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

    const setCategory = (item) => {
        setCategoryId(item);
    };

    const setAssistanceCategory = (item) => {
        setAssistanceCategoryId(item);
    };

    // Efecto mejorado para manejar cambios de filtros y tabs
    useEffect(() => {
        console.log("---selectedOption", selectedOption)
        console.log("---activeTab", activeTab)
        if (selectedOption && selectedOption.value) {
            if (activeTab === 'products') {
                dispatch({ type: productActionType.RESET_PRODUCT });
                setPage(1);
                fetchBrandClickable(brandId, categoryId, selectedOption.value, 1, "", true);
            } else if (activeTab === 'assistances') {
                dispatch({ type: asistancesActionType.RESET_ASSISTANCE });
                setPage(1);
                fetchAssistanceClickable(assistanceCategoryId, selectedOption.value, 1, "", true);
            }
        }
    }, [selectedOption, brandId, categoryId, assistanceCategoryId, activeTab]);

    // Cargar todas las asistencias cuando se cambia al tab de assistances
    // useEffect(() => {
    //     if (activeTab === 'assistances' && selectedOption && selectedOption.value) {
    //         dispatch(posAllAssistance({
    //             warehouse_id: selectedOption.value
    //         }));
    //     }
    // }, [activeTab, selectedOption, dispatch]);

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
        if (updateProducts.length === 0) {
            dispatch(addToast({
                text: getFormattedMessage("pos.cash-payment.product-error.message"),
                type: toastType.ERROR
            }));
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
        if (event.target.name === 'discount_value') {
            if (cartItemValue.discount_type === discountType.FIXED) {
                discount = value;
            } else {
                discount = (Number(subTotal) * Number(value)) / 100;
            }
        }
        if (event.target.name === 'discount_type') {
            if (value === discountType.FIXED) {
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
        if (updateProducts.length === 0) {
            dispatch(addToast({
                text: getFormattedMessage("pos.cash-payment.product-error.message"),
                type: toastType.ERROR
            }));
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
        const existingCart = updateProducts.filter((e) => {
            const currentItemType = e.item_type || 'product';
            return !(e.id === itemId && currentItemType === itemType);
        });
        updateCart(existingCart);
    };

    const addToCarts = (items) => {
        updateCart(items);
    };

    const onScrollCallAPI = (page) => {
        if (activeTab === 'products') {
            fetchBrandClickable(brandId, categoryId, selectedOption.value, page);
        } else if (activeTab === 'assistances') {
            fetchAssistanceClickable(
                assistanceCategoryId || null,
                selectedOption.value,
                page,
                "",
                false
            );
        }
    };

    const onSearchProduct = (search) => {
        fetchBrandClickable(brandId, categoryId, selectedOption.value, 1, search, true);
    };

    const onSearchAssistance = (search) => {
        dispatch({ type: asistancesActionType.RESET_ASSISTANCE });
        setPage(1);
        fetchAssistanceClickable(
            assistanceCategoryId || null,
            selectedOption.value,
            1,
            search,
            true
        );
    };

    const handleTabChange = (tab) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            setPage(1);

            if (tab === 'products') {
                setAssistanceCategoryId(null);
                if (selectedOption?.value && (!posAllProducts?.length || brandId || categoryId)) {
                    dispatch({ type: productActionType.RESET_PRODUCT });
                    setLoading(true); // Activar loading antes de la llamada
                    fetchBrandClickable(brandId, categoryId, selectedOption.value, 1, "", true)
                        .finally(() => setLoading(false)); // Desactivar loading al finalizar
                }
            } else if (tab === 'assistances') {
                setBrandId(null);
                setCategoryId(null);
                if (selectedOption?.value) {
                    dispatch({ type: asistancesActionType.RESET_ASSISTANCE });
                    setLoading(true); // Activar loading antes de la llamada
                    fetchAssistanceClickable(null, selectedOption.value, 1, "", true)
                        .finally(() => setLoading(false)); // Desactivar loading al finalizar
                }
            }
        }
    };
    // const handleTabChange = (tab) => {
    //     if (tab !== activeTab) {
    //         setActiveTab(tab);
    //         setPage(1);

    //         if (tab === 'products') {
    //             setAssistanceCategoryId(null);
    //             // Limpiar y recargar productos solo si es necesario
    //             if (selectedOption?.value && (!posAllProducts?.length || brandId || categoryId)) {
    //                 dispatch({ type: productActionType.RESET_PRODUCT });
    //                 fetchBrandClickable(brandId, categoryId, selectedOption.value, 1, "", true);
    //             }
    //         } else if (tab === 'assistances') {
    //             setBrandId(null);
    //             setCategoryId(null);
    //             // SOLO una llamada para cargar asistencias
    //             if (selectedOption?.value) {
    //                 dispatch({ type: asistancesActionType.RESET_ASSISTANCE });
    //                 fetchAssistanceClickable(null, selectedOption.value, 1, "", true);
    //                 // REMOVER esta línea duplicada:
    //                 // dispatch(posAllAssistance({ warehouse_id: selectedOption.value }));
    //             }
    //         }
    //     }
    // };

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

    const debugSaleItems = () => {
        console.log('=== DEBUGGING SALE ITEMS ===');
        const sale_items = updateProducts.map(item => {
            const saleItem = {
                id: item.id,
                type: item.item_type || 'product',
                name: item.name,
                quantity: item.quantity,
            };

            if (item.item_type === 'assistance') {
                saleItem.asistence_id = item.id;
                saleItem.price = Number(item.asistence_price || item.price || 0);
                saleItem.original_asistence_price = item.asistence_price;
                saleItem.original_price = item.price;
            } else {
                saleItem.product_id = item.id;
                saleItem.price = Number(item.product_price || item.price || item.fix_net_unit || 0);
                saleItem.original_product_price = item.product_price;
                saleItem.original_price = item.price;
                saleItem.original_fix_net_unit = item.fix_net_unit;
            }

            return saleItem;
        });

        console.log('Prepared sale_items:', sale_items);
        console.log('============================');
        return sale_items;
    };


    const sale_items = updateProducts.map(item => {
        if (item.item_type === 'assistance') {
            return {
                asistence_id: item.id,
                quantity: Number(item.quantity) || 1,
                price: Number(item.price) || 0,
            };
        } else {
            return {
                product_id: item.id,
                quantity: Number(item.quantity) || 1,
                price: Number(item.price) || 0,
            };
        }
    })
    console.log(sale_items, 'sale_items');


    const prepareData = (updateProducts) => {
        const sale_items = updateProducts.map(item => {
            if (item.item_type === 'assistance') {
                return {
                    asistence_id: item.id,
                    quantity: Number(item.quantity) || 1,
                    price: Number(item.asistence_price || item.price || 0),
                    sale_unit: Number(item.sale_unit || item.product_unit || item.attributes?.sale_unit || item.attributes?.product_unit || 1),
                };
            } else {
                // Para productos, usar product_price
                return {
                    product_id: item.id,
                    quantity: Number(item.quantity) || 1,
                    price: Number(item.product_price || item.price || 0),
                    sale_unit: Number(item.sale_unit || item.product_unit || item.attributes?.sale_unit || item.attributes?.product_unit || 1),
                };
            }
        });

        const formValue = {
            date: moment(new Date()).format("YYYY-MM-DD"),
            customer_id: selectedCustomerOption && selectedCustomerOption[0] ?
                selectedCustomerOption[0].value :
                selectedCustomerOption && selectedCustomerOption.value,
            warehouse_id: selectedOption && selectedOption[0]
                ? selectedOption[0].value
                : selectedOption && selectedOption.value,
            sale_items: sale_items,
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
        console.log('📤 Final form data for backend:', formValue);

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
            setCartAssistanceIds("");
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

    const addAssistanceToCart = (assistance) => {
        console.log('Adding assistance to cart:', assistance);

        if (!assistance || !assistance.id) {
            console.error('❌ Invalid assistance data:', assistance);
            return;
        }

        const existingCart = [...updateProducts];
        const assistanceInCart = existingCart.find(
            item => item.id === assistance.id && item.item_type === 'assistance'
        );

        if (assistanceInCart) {
            assistanceInCart.quantity = (assistanceInCart.quantity || 1) + 1;
        } else {
            const assistancePrice = Number(assistance.attributes?.asistence_price || 0);

            const preparedAssistance = {
                id: assistance.id,
                item_type: 'assistance',
                name: assistance.attributes?.name || 'Servicio sin nombre',
                code: assistance.attributes?.code || '',
                // Asegurar precios correctos
                asistence_price: assistancePrice,
                price: assistancePrice, // Campo alternativo
                cost: Number(assistance.attributes?.asistence_cost || 0),
                unit: assistance.attributes?.asistence_unit || '1',
                estimated_duration: Number(assistance.attributes?.estimated_duration || 0),
                quantity: 1,
                order_tax: Number(assistance.attributes?.order_tax || 0),
                tax_type: assistance.attributes?.tax_type || '1',
                description: assistance.attributes?.description || '',
                notes: assistance.attributes?.notes || '',
                category_id: assistance.attributes?.asistence_category_id,
                warehouse_id: selectedOption?.value,
                image: assistance.attributes?.image_url || '/images/default-service-icon.png',
                attributes: assistance.attributes,
            };

            existingCart.push(preparedAssistance);
        }

        setUpdateProducts(existingCart);
    };

    const addProductToCart = (product) => {
        console.log('Adding product to cart:', product);

        if (!product || !product.id) {
            console.error('❌ Invalid product data:', product);
            return;
        }

        const existingCart = [...updateProducts];
        const productInCart = existingCart.find(
            item => item.id === product.id && item.item_type !== 'assistance'
        );

        if (productInCart) {
            // Si ya existe, incrementar cantidad
            productInCart.quantity = (productInCart.quantity || 1) + 1;
            console.log('Incremented quantity for product:', productInCart);
        } else {
            // Si no existe, añadir nuevo producto
            const attributes = product.attributes || {};

            const preparedProduct = {
                id: product.id,
                item_type: 'product', // Identificador para productos
                name: attributes.name || 'Producto sin nombre',
                code: attributes.code || attributes.product_code || '',
                product_code: attributes.product_code || attributes.code || '',

                // Precios y costos
                product_price: Number(attributes.product_price || 0),
                product_cost: Number(attributes.product_cost || 0),
                price: Number(attributes.product_price || 0), // Campo alternativo
                cost: Number(attributes.product_cost || 0),   // Campo alternativo

                // Unidades
                product_unit: attributes.product_unit || '1',
                sale_unit: attributes.sale_unit || '1',
                purchase_unit: attributes.purchase_unit || '1',

                // Stock y alertas
                stock_alert: Number(attributes.stock_alert || 0),
                quantity_limit: Number(attributes.quantity_limit || 0),
                in_stock: Number(attributes.in_stock || 0),

                // Cantidad inicial
                quantity: 1,

                // Impuestos
                order_tax: Number(attributes.order_tax || 0),
                tax_type: attributes.tax_type || '1',

                // Información adicional
                notes: attributes.notes || '',
                expiry_date: attributes.expiry_date || null,

                // Categoría y marca
                product_category_id: attributes.product_category_id,
                brand_id: attributes.brand_id,
                product_category_name: attributes.product_category_name || '',
                brand_name: attributes.brand_name || '',

                // Imagen
                image: attributes.images?.imageUrls?.[0] || '/images/default-product-icon.png',
                images: attributes.images || null,

                // Unidades con nombres
                product_unit_name: attributes.product_unit_name,
                sale_unit_name: attributes.sale_unit_name,
                purchase_unit_name: attributes.purchase_unit_name,

                // Stock por almacén
                stock: attributes.stock,
                warehouse: attributes.warehouse,

                // Código de barras
                barcode_url: attributes.barcode_url || '',
                barcode_symbol: attributes.barcode_symbol || 1,

                // Almacén seleccionado
                warehouse_id: selectedOption?.value,

                // Mantener referencia completa a los atributos originales
                attributes: attributes
            };

            // Verificar stock antes de agregar
            if (preparedProduct.in_stock <= 0) {
                dispatch(addToast({
                    text: `El producto "${preparedProduct.name}" no tiene stock disponible`,
                    type: toastType.WARNING
                }));
                return;
            }

            existingCart.push(preparedProduct);
            console.log('Added new product to cart:', preparedProduct);
        }

        setUpdateProducts(existingCart);
        updateCart(existingCart);

        // Actualizar IDs para control
        const productIds = existingCart
            .filter(item => item.item_type !== 'assistance')
            .map(item => item.id);
        setCartProductIds(productIds);

        // Mostrar mensaje de éxito
        dispatch(addToast({
            text: `Producto "${product.attributes?.name}" agregado al carrito`,
            type: toastType.SUCCESS
        }));
    };

    // const addAssistanceToCart = (assistance) => {
    //     console.log('Adding assistance to cart:', assistance);

    //     if (!assistance || !assistance.id) {
    //         console.error('❌ Invalid assistance data:', assistance);
    //         return;
    //     }

    //     const existingCart = [...updateProducts];
    //     const assistanceInCart = existingCart.find(
    //         item => item.id === assistance.id && item.item_type === 'assistance'
    //     );

    //     if (assistanceInCart) {
    //         // Si ya existe, incrementar cantidad
    //         assistanceInCart.quantity = (assistanceInCart.quantity || 1) + 1;
    //         console.log('Incremented quantity for assistance:', assistanceInCart);
    //     } else {
    //         // Si no existe, añadir nueva asistencia
    //         const preparedAssistance = {
    //             id: assistance.id,
    //             item_type: 'assistance',
    //             name: assistance.attributes?.name || 'Servicio sin nombre',
    //             code: assistance.attributes?.code || '',
    //             price: Number(assistance.attributes?.asistence_price || 0),
    //             cost: Number(assistance.attributes?.asistence_cost || 0),
    //             unit: assistance.attributes?.asistence_unit || '1',
    //             estimated_duration: Number(assistance.attributes?.estimated_duration || 0),
    //             quantity: 1,
    //             order_tax: Number(assistance.attributes?.order_tax || 0),
    //             tax_type: assistance.attributes?.tax_type || '1',
    //             description: assistance.attributes?.description || '',
    //             notes: assistance.attributes?.notes || '',
    //             category_id: assistance.attributes?.asistence_category_id,
    //             warehouse_id: selectedOption?.value,
    //             image: assistance.attributes?.image_url || '/images/default-service-icon.png',
    //             attributes: assistance.attributes,
    //             // Campos adicionales para compatibilidad con el sistema existente
    //             asistence_price: Number(assistance.attributes?.asistence_price || 0),
    //             asistence_cost: Number(assistance.attributes?.asistence_cost || 0),
    //             asistence_unit: assistance.attributes?.asistence_unit || '1'
    //         };

    //         existingCart.push(preparedAssistance);
    //         console.log('Added new assistance to cart:', preparedAssistance);
    //     }

    //     setUpdateProducts(existingCart);
    //     updateCart(existingCart);

    //     // Actualizar IDs para control
    //     const assistanceIds = existingCart
    //         .filter(item => item.item_type === 'assistance')
    //         .map(item => item.id);
    //     setCartAssistanceIds(assistanceIds);
    // };



    const isAssistanceInCart = (assistanceId) => {
        return updateProducts.some(item =>
            item.id === assistanceId && item.item_type === 'assistance'
        );
    };

    // 2. Define la función para verificar si una asistencia está en el carrito
    // const isAssistanceInCart = (assistanceId) => {
    //     return updateProducts.some(item =>
    //         item.id === assistanceId && item.item_type === 'assistance'
    //     );
    // };


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

    const isProductInCart = (productId) => {
        return updateProducts.some(item =>
            item.id === productId && item.item_type !== 'assistance'
        );
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

    const prepareAssistanceForCart = (assistance) => {
        const attributes = assistance.attributes || {};

        return {
            id: assistance.id,
            item_type: 'assistance', // Identificador crucial
            name: attributes.name || 'Servicio sin nombre',
            code: attributes.code || '',
            // Usar los campos correctos de tu JSON
            price: attributes.asistence_price || 0,
            cost: attributes.asistence_cost || 0,
            unit: attributes.asistence_unit || '1',
            estimated_duration: attributes.estimated_duration || 0,
            quantity: 1, // Cantidad inicial
            // Campos de impuestos
            order_tax: attributes.order_tax || 0,
            tax_type: attributes.tax_type || '1',
            // Información adicional
            description: attributes.description || '',
            notes: attributes.notes || '',
            category_id: attributes.asistence_category_id,
            // Mantener referencia completa
            attributes: attributes
        };
    };

    const debugCartData = () => {
        console.log('=== CART DEBUG INFO ===');
        console.log('Update Products:', updateProducts);
        console.log('Active Tab:', activeTab);

        const products = updateProducts.filter(item => item.item_type !== 'assistance');
        const assistances = updateProducts.filter(item => item.item_type === 'assistance');

        console.log('Products in cart:', products.length, products);
        console.log('Assistances in cart:', assistances.length, assistances);

        console.log('Totals calculation:');
        updateProducts.forEach(item => {
            const cost = calculateItemCost(item);
            const qty = item.quantity || 0;
            const total = cost * qty;
            console.log(`- ${item.name}: ${cost} x ${qty} = ${total}`);
        });

        console.log('Final totals:', { totalQty, subTotal, grandTotal });
        console.log('======================');
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

                        <div className="custom-card h-100 mb-3">
                            <div className="p-3">
                                <Nav className='button-list mb-2 d-flex flex-nowrap'>
                                    <Nav.Item className='button-list__item me-2'>
                                        <Button
                                            variant={activeTab === 'products' ? 'primary' : 'outline-primary'}
                                            onClick={() => handleTabChange('products')}
                                        >
                                            {getFormattedMessage('Productos') || 'Productos'}
                                        </Button>
                                    </Nav.Item>
                                    <Nav.Item className='button-list__item me-2'>
                                        <Button
                                            variant={activeTab === 'assistances' ? 'info' : 'outline-info'}
                                            onClick={() => handleTabChange('assistances')}
                                        >
                                            {getFormattedMessage('Servicios') || 'Servicios'}
                                        </Button>
                                    </Nav.Item>
                                </Nav>
                                <hr />
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
                                        assistanceCategoryId={assistanceCategoryId}
                                    />
                                )}
                            </div>

                            {activeTab === 'products' ? (
                                <Product
                                    cartProducts={updateProducts}
                                    updateCart={addToCarts}
                                    addProductToCart={addProductToCart}  // Nueva función
                                    isProductInCart={isProductInCart}    // Nueva función
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
                                    isAssistanceInCart={isAssistanceInCart}
                                    posAllAssistances={posAllAssistances}
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
                                    addAssistanceToCart={addAssistanceToCart}
                                />
                                // <Assistance


                                //     isAssistanceInCart={isAssistanceInCart}
                                //     posAllAssistances={posAllAssistances}
                                //     cartProducts={updateProducts}
                                //     updateCart={addToCarts}
                                //     customCart={customCart}
                                //     setCartAssistanceIds={setCartAssistanceIds}
                                //     cartAssistanceIds={cartAssistanceIds}
                                //     settings={settings}
                                //     selectedOption={selectedOption}
                                //     onScrollCallAPI={onScrollCallAPI}
                                //     page={page}
                                //     setPage={setPage}
                                //     addAssistanceToCart={addAssistanceToCart}
                                // />
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
        posAllAssistances,
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
        posAllProducts: posAllProducts || [],
        posAllAssistances: posAllAssistances || [],
        frontSetting,
        settings,
        paymentDetails: cashPayment,
        customCart: prepareCartArray(posAllProducts || []),
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
    fetchAssistanceClickable,
    fetchHoldLists,
})(PosMainPage);
