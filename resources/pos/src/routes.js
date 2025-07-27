import Dashboard from "./components/dashboard/Dashboard";
import Brands from "./components/brands/Brands";
import Currencies from "./components/currency/Currencies";
import Warehouses from "./components/warehouse/Warehouses";
import CreateWarehouse from "./components/warehouse/CreateWarehouse";
import EditWarehouse from "./components/warehouse/EditWarehouse";
import ProductCategory from "./components/productCategory/ProductCategory";
import Units from "./components/units/Units";
import Suppliers from "./components/supplier/Suppliers";
import CreateSupplier from "./components/supplier/CreateSupplier";
import EditSupplier from "./components/supplier/EditSupplier";
import Customers from "./components/customer/Customers";
import CreateCustomer from "./components/customer/CreateCustomer";
import EditCustomer from "./components/customer/EditCustomer";
import User from "./components/users/User";
import CreateUser from "./components/users/CreateUser";
import EditUser from "./components/users/EditUser";
import UserDetail from "./components/users/UserDetail";
import UpdateProfile from "./components/user-profile/UpdateProfile";
import Product from "./components/product/Product";
import CreateProduct from "./components/product/CreateProduct";
import EditProduct from "./components/product/EditProduct";
import ProductDetail from "./components/product/ProductDetail";
import Settings from "./components/settings/Settings";
import ExpenseCategory from "./components/expense-category/ExpenseCategory";
import Expenses from "./components/expense/Expenses";
import CreateExpense from "./components/expense/CreateExpense";
import EditExpense from "./components/expense/EditExpense";
import Purchases from "./components/purchase/Purchases";
import CreatePurchase from "./components/purchase/CreatePurchase";
import EditPurchase from "./components/purchase/EditPurchase";
import PurchaseDetails from "./components/purchase/PurchaseDetails";
import PosMainPage from "./frontend/components/PosMainPage";
import PrintData from "./frontend/components/printModal/PrintData";
import Sales from "./components/sales/Sales";
import CreateSale from "./components/sales/CreateSale";
import EditSale from "./components/sales/EditSale";
import SaleReturn from "./components/saleReturn/SaleReturn";
import CreateSaleReturn from "./components/saleReturn/CreateSaleReturn";
import EditSaleReturn from "./components/saleReturn/EditSaleReturn";
import SaleReturnDetails from "./components/saleReturn/SaleReturnDetails";
import SaleDetails from "./components/sales/SaleDetails";
import PurchaseReturn from "./components/purchaseReturn/PurchaseReturn";
import CreatePurchaseReturn from "./components/purchaseReturn/CreatePurchaseReturn";
import EditPurchaseReturn from "./components/purchaseReturn/EditPurchaseReturn";
import PurchaseReturnDetails from "./components/purchaseReturn/PurchaseReturnDetails";
import WarehouseReport from "./components/report/warehouseReport/WarehouseReport";
import SaleReport from "./components/report/saleReport/SaleReport";
import StockReport from "./components/report/stockReport/StockReport";
import StockDetails from "./components/report/stockReport/StockDetails";
import TopSellingProductsReport from "./components/report/topSellingReport/TopSellingProductsReport";
import PurchaseReport from "./components/report/purchaseReport/PurchaseReport";
import PrintBarcode from "./components/printBarcode/PrintBarcode";
import { Permissions } from "./constants";
import Role from "./components/roles/Role";
import CreateRole from "./components/roles/CreateRole";
import EditRole from "./components/roles/EditRole";
import Adjustments from "./components/adjustments/Adjustments";
import CreateAdjustment from "./components/adjustments/CreateAdjustment";
import EditAdjustMent from "./components/adjustments/EditAdjustMent";
import WarehouseDetail from "./components/warehouse/WarehouseDetail";
import ProductQuantityReport from "./components/report/productQuantityReport/ProductQuantityReport";
import Transfers from "./components/transfers/Transfers";
import EditTransfer from "./components/transfers/EditTransfer";
import CreateTransfer from "./components/transfers/CreateTransfer";
import Prefixes from "./components/settings/Prefixes";
import SuppliersReport from "./components/report/supplier-report/SuppliersReport";
import SupplierReportDetails from "./components/report/supplier-report/SupplierReportDetails";
import EmailTemplates from "./components/Email-templates/EmailTemplates";
import EditEmailTemplate from "./components/Email-templates/EditEmailTemplate";
import Quotations from "./components/quotations/Quotations";
import CreateQuotation from "./components/quotations/CreateQuotation";
import EditQuotation from "./components/quotations/EditQuotation";
import CreateQuotationSale from "./components/quotations/CreateQuotationSale";
import QuotationDetails from "./components/quotations/QuotationDetails";
import MailSettings from "./components/admin/AdminSettings/MailSettings";
import SmsTemplates from "./components/sms-templates/SmsTemplates";
import EditSmsTemplate from "./components/sms-templates/EditSmsTemplate";
import BestCustomerReport from "./components/report/best-customerReport/BestCustomerReport";
import ProfitLossReport from "./components/report/ProfitLossReport/ProfitLossReport";
import CustomerReportDetails from "./components/report/customer-report/CustomerReportDetails";
import CustomersReport from "./components/report/customer-report/CustomersReport";
import SmsApi from "./components/sms-api/SmsApi";
import EditSaleReturnFromSale from "./components/saleReturn/EditSaleReturnFromSale";
import Language from "./components/languages/Language";
import EditLanguageData from "./components/languages/EditLanguageData";
import BaseUnits from "./components/base-unit/BaseUnits";
import RegisterReport from "./components/report/registerReport/RegisterReport";
import Variation from "./components/variation/Variation";
import ReceiptSettings from "./components/settings/ReceiptSettings";
import AdminDashboard from "./components/admin/dashboard/AdminDashboard"
import Users from "./components/admin/users";
import AdminSettings from "./components/admin/AdminSettings";
import Subscriptions from "./components/admin/subscriptions";
import CashPayments from "./components/admin/cash-payments";
import Plans from "./components/admin/plans";
import CreateAdminUser from "./components/admin/users/CreateAdminUser";
import EditAdminUser from "./components/admin/users/EditAdminUser";
import CreatePlan from "./components/admin/plans/CreatePlan";
import EditPlan from "./components/admin/plans/EditPlan";
import PaymentSettings from "./components/admin/AdminSettings/PaymentSettings";
import ManageSubscription from "./components/manage-subscription";
import UpgradePlan from "./components/manage-subscription/upgrade-plan";
import ComparePlan from "./components/manage-subscription/ComparePlan";
import PaymentSuccess from "./components/PaymentVerify/PaymentSuccess";
import PaymentFailed from "./components/PaymentVerify/PaymentFailed";
import Transactions from "./components/admin/transactions";
import AdminUserDetail from "./components/admin/users/AdminUserDetail";
import HeroSection from "./components/admin/front-cms/heroSection";
import Services from "./components/admin/front-cms/services";
import Partners from "./components/admin/front-cms/partners";
import WhyChooseUs from "./components/admin/front-cms/why-choose-us";
import Testimonials from "./components/admin/front-cms/testimonials";
import FAQs from "./components/admin/front-cms/FAQs";
import ServicesForm from "./components/admin/front-cms/services/ServicesForm";
import PrivacyPolicy from "./components/admin/front-cms/pages/PrivacyPolicy";
import RefundPolicy from "./components/admin/front-cms/pages/RefundPolicy";
import TermsAndConditions from "./components/admin/front-cms/pages/TermsAndConditions";
import Inquiries from "./components/admin/Inquiries";
import Features from "./components/admin/front-cms/features";
import Steps from "./components/admin/front-cms/steps";
import Store from "./components/store";
import EditPurchaseReturnForm from "./components/purchaseReturn/EditPurchaseReturnForm";
import Taxes from "./components/settings/Taxes/Taxes";
import PosSetting from "./components/settings/PosSetting";
import CustomerDisplay from "./components/customerDisplay/customerDisplay";
import DualScreenSetting from "./components/dualScreenSetting/DualScreenSetting";
import Assistances from "./components/assistances/Assistances";
import CreateAssistance from "./components/assistances/CreateAssistances";
import EditAssistance from "./components/assistances/EditAssistances";
import AssistancesDetail from "./components/assistances/AssistancesDetail";
import AssistanceCategories from "./components/assistancesCategory/AssistanceCategories";
//import CreateAssistance from "./components/assistances/CreateAssistances";
//import EditAssistance from "./components/assistances/EditAssistances";
// import AssistancesDetail from "./components/assistances/AssistancesDetail";


export const route = [
    {
        path: "dashboard",
        ele: <Dashboard />,
        permission: Permissions.MANAGE_DASHBOARD,
    },
    {
        path: "brands",
        ele: <Brands />,
        permission: Permissions.MANAGE_BRANDS,
    },
    // {
    //     path: "currencies",
    //     ele: <Currencies />,
    //     permission: Permissions.MANAGE_CURRENCY,
    // },
    {
        path: "warehouse",
        ele: <Warehouses />,
        permission: Permissions.MANAGE_WAREHOUSES,
    },
    {
        path: "warehouse/create",
        ele: <CreateWarehouse />,
        permission: Permissions.MANAGE_WAREHOUSES,
    },
    {
        path: "warehouse/edit/:id",
        ele: <EditWarehouse />,
        permission: Permissions.MANAGE_WAREHOUSES,
    },
    {
        path: "warehouse/detail/:id",
        ele: <WarehouseDetail />,
        permission: Permissions.MANAGE_WAREHOUSES,
    },
    {
        path: "product-categories",
        ele: <ProductCategory />,
        permission: Permissions.MANAGE_PRODUCT_CATEGORIES,
    },
    {
        path: "variations",
        ele: <Variation />,
        permission: Permissions.MANAGE_VARIATIONS,
    },

    {
        path: "units",
        ele: <Units />,
        permission: Permissions.MANAGE_UNITS,
    },
    {
        path: "base-units",
        ele: <BaseUnits />,
        permission: Permissions.MANAGE_UNITS,
    },
    {
        path: "suppliers",
        ele: <Suppliers />,
        permission: Permissions.MANAGE_SUPPLIERS,
    },
    {
        path: "suppliers/create",
        ele: <CreateSupplier />,
        permission: Permissions.MANAGE_SUPPLIERS,
    },
    {
        path: "suppliers/edit/:id",
        ele: <EditSupplier />,
        permission: Permissions.MANAGE_SUPPLIERS,
    },
    {
        path: "customers",
        ele: <Customers />,
        permission: Permissions.MANAGE_CUSTOMERS,
    },
    {
        path: "customers/create",
        ele: <CreateCustomer />,
        permission: Permissions.MANAGE_CUSTOMERS,
    },
    {
        path: "customers/edit/:id",
        ele: <EditCustomer />,
        permission: Permissions.MANAGE_CUSTOMERS,
    },
    {
        path: "users",
        ele: <User />,
        permission: Permissions.MANAGE_USER,
    },
    {
        path: "users/create",
        ele: <CreateUser />,
        permission: Permissions.MANAGE_USER,
    },
    {
        path: "users/edit/:id",
        ele: <EditUser />,
        permission: Permissions.MANAGE_USER,
    },
    {
        path: "users/detail/:id",
        ele: <UserDetail />,
        permission: Permissions.MANAGE_USER,
    },
    {
        path: "profile/edit",
        ele: <UpdateProfile />,
        permission: "",
    },
    {
        path: "products",
        ele: <Product />,
        permission: Permissions.MANAGE_PRODUCTS,
    },
    {
        path: "products/create",
        ele: <CreateProduct />,
        permission: Permissions.MANAGE_PRODUCTS,
    },
    {
        path: "products/edit/:id",
        ele: <EditProduct />,
        permission: Permissions.MANAGE_PRODUCTS,
    },
    {
        path: "products/detail/:id",
        ele: <ProductDetail />,
        permission: Permissions.MANAGE_PRODUCTS,
    },
    {
        path: "adjustments",
        ele: <Adjustments />,
        permission: Permissions.MANAGE_ADJUSTMENTS,
    },
    {
        path: "adjustments/create",
        ele: <CreateAdjustment />,
        permission: Permissions.MANAGE_ADJUSTMENTS,
    },
    {
        path: "adjustments/:id",
        ele: <EditAdjustMent />,
        permission: Permissions.MANAGE_ADJUSTMENTS,
    },
    {
        path: "settings",
        ele: <Settings />,
        permission: Permissions.MANAGE_SETTING,
    },
    {
        path: "store",
        ele: <Store />,
        permission: "",
    },
    {
        path: "prefixes",
        ele: <Prefixes />,
        permission: Permissions.MANAGE_SETTING,
    },
    {
        path: "mail-settings",
        ele: <MailSettings />,
        permission: Permissions.MANAGE_SETTING,
    },
    {
        path: "receipt-settings",
        ele: <ReceiptSettings />,
        permission: Permissions.MANAGE_SETTING,
    },
    {
        path: "taxes",
        ele: <Taxes />,
        permission: Permissions.MANAGE_SETTING
    },
    {
        path: "pos-settings",
        ele: <PosSetting />,
        permission: Permissions.MANAGE_SETTING,
    },
    {
        path: "dual-screen-settings",
        ele: <DualScreenSetting />,
        permission: Permissions.MANAGE_SETTING,
    },
    {
        path: "expense-categories",
        ele: <ExpenseCategory />,
        permission: Permissions.MANAGE_EXPENSES_CATEGORIES,
    },
    {
        path: "expenses",
        ele: <Expenses />,
        permission: Permissions.MANAGE_EXPENSES,
    },
    {
        path: "expenses/create",
        ele: <CreateExpense />,
        permission: Permissions.MANAGE_EXPENSES,
    },
    {
        path: "expenses/edit/:id",
        ele: <EditExpense />,
        permission: Permissions.MANAGE_EXPENSES,
    },
    {
        path: "purchases",
        ele: <Purchases />,
        permission: Permissions.MANAGE_PURCHASE,
    },
    {
        path: "purchases/create",
        ele: <CreatePurchase />,
        permission: Permissions.MANAGE_PURCHASE,
    },
    {
        path: "purchases/edit/:id",
        ele: <EditPurchase />,
        permission: Permissions.MANAGE_PURCHASE,
    },
    {
        path: "purchases/detail/:id",
        ele: <PurchaseDetails />,
        permission: Permissions.MANAGE_PURCHASE,
    },
    {
        path: "purchases/return/:id",
        ele: <CreatePurchaseReturn />,
        permission: Permissions.MANAGE_PURCHASE_RETURN,
    },
    {
        path: "purchases/return/edit/:id",
        ele: <EditPurchaseReturn />,
        permission: Permissions.MANAGE_PURCHASE_RETURN,
    },
    {
        path: "pos",
        ele: <PosMainPage />,
        permission: Permissions.MANAGE_POS_SCREEN,
    },
    {
        path: "/payment",
        ele: <PrintData />,
        permission: "",
    },
    {
        path: "user-detail",
        ele: <UserDetail />,
        permission: Permissions.MANAGE_USER,
    },
    {
        path: "sales",
        ele: <Sales />,
        permission: Permissions.MANAGE_SALE,
    },
    {
        path: "sales/create",
        ele: <CreateSale />,
        permission: Permissions.MANAGE_SALE,
    },
    {
        path: "sales/edit/:id",
        ele: <EditSale />,
        permission: Permissions.MANAGE_SALE,
    },
    {
        path: "sales/return/:id",
        ele: <CreateSaleReturn />,
        permission: Permissions.MANAGE_SALE_RETURN,
    },
    {
        path: "sales/return/edit/:id",
        ele: <EditSaleReturnFromSale />,
        permission: Permissions.MANAGE_SALE_RETURN,
    },
    {
        path: "quotations",
        ele: <Quotations />,
        permission: Permissions.MANAGE_QUOTATION,
    },
    {
        path: "quotations/create",
        ele: <CreateQuotation />,
        permission: Permissions.MANAGE_QUOTATION,
    },
    {
        path: "quotations/edit/:id",
        ele: <EditQuotation />,
        permission: Permissions.MANAGE_QUOTATION,
    },
    {
        path: "quotations/Create_sale/:id",
        ele: <CreateQuotationSale />,
        permission: Permissions.MANAGE_QUOTATION,
    },
    {
        path: "quotations/detail/:id",
        ele: <QuotationDetails />,
        permission: Permissions.MANAGE_QUOTATION,
    },
    {
        path: "sale-return",
        ele: <SaleReturn />,
        permission: Permissions.MANAGE_SALE_RETURN,
    },
    {
        path: "sale-return/edit/:id",
        ele: <EditSaleReturn />,
        permission: Permissions.MANAGE_SALE_RETURN,
    },
    {
        path: "sale-return/detail/:id",
        ele: <SaleReturnDetails />,
        permission: Permissions.MANAGE_SALE_RETURN,
    },
    {
        path: "sales/detail/:id",
        ele: <SaleDetails />,
        permission: Permissions.MANAGE_SALE,
    },
    {
        path: "purchase-return",
        ele: <PurchaseReturn />,
        permission: Permissions.MANAGE_PURCHASE_RETURN,
    },
    {
        path: "purchase-return/create",
        ele: <CreatePurchaseReturn />,
        permission: Permissions.MANAGE_PURCHASE_RETURN,
    },
    {
        path: "purchase-return/edit/:id",
        ele: <EditPurchaseReturnForm />,
        permission: Permissions.MANAGE_PURCHASE_RETURN,
    },
    {
        path: "purchase-return/detail/:id",
        ele: <PurchaseReturnDetails />,
        permission: Permissions.MANAGE_PURCHASE_RETURN,
    },
    {
        path: "report/report-warehouse",
        ele: <WarehouseReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-sale",
        ele: <SaleReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-stock",
        ele: <StockReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-detail-stock/:id",
        ele: <StockDetails />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-top-selling-products",
        ele: <TopSellingProductsReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-product-quantity",
        ele: <ProductQuantityReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-purchase",
        ele: <PurchaseReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/suppliers",
        ele: <SuppliersReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/profit-loss",
        ele: <ProfitLossReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/suppliers/details/:id",
        ele: <SupplierReportDetails />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "print/barcode",
        ele: <PrintBarcode />,
        permission: Permissions.MANAGE_PRODUCTS,
    },
    {
        path: "roles",
        ele: <Role />,
        permission: Permissions.MANAGE_ROLES,
    },
    {
        path: "roles/create",
        ele: <CreateRole />,
        permission: Permissions.MANAGE_ROLES,
    },
    {
        path: "roles/edit/:id",
        ele: <EditRole />,
        permission: Permissions.MANAGE_ROLES,
    },
    {
        path: "transfers",
        ele: <Transfers />,
        permission: Permissions.MANAGE_TRANSFERS,
    },
    {
        path: "transfers/create",
        ele: <CreateTransfer />,
        permission: Permissions.MANAGE_TRANSFERS,
    },
    {
        path: "transfers/:id",
        ele: <EditTransfer />,
        permission: Permissions.MANAGE_TRANSFERS,
    },
    {
        path: "email-templates",
        ele: <EmailTemplates />,
        permission: Permissions.MANAGE_EMAIL_TEMPLATES,
    },
    {
        path: "email-templates/:id",
        ele: <EditEmailTemplate />,
        permission: Permissions.MANAGE_EMAIL_TEMPLATES,
    },
    {
        path: "sms-templates",
        ele: <SmsTemplates />,
        permission: Permissions.MANAGE_SMS_TEMPLATES,
    },
    {
        path: "sms-templates/:id",
        ele: <EditSmsTemplate />,
        permission: Permissions.MANAGE_SMS_TEMPLATES,
    },
    {
        path: "report/best-customers",
        ele: <BestCustomerReport />,
        permission: "",
    },
    {
        path: "report/customers",
        ele: <CustomersReport />,
        permission: "",
    },
    {
        path: "report/customers/details/:id",
        ele: <CustomerReportDetails />,
        permission: "",
    },
    {
        path: "report/register",
        ele: <RegisterReport />,
        permission: "",
    },
    {
        path: "sms-api",
        ele: <SmsApi />,
        permission: Permissions.MANAGE_SMS_API,
    },
    // {
    //     path: "languages",
    //     ele: <Language />,
    //     permission: Permissions.MANAGE_LANGUAGES,
    // },
    // {
    //     path: "languages/:id",
    //     ele: <EditLanguageData />,
    //     permission: Permissions.MANAGE_LANGUAGES,
    // },
    {
        path: "manage-subscription",
        ele: <ManageSubscription />,
        permission: "",
    },
    {
        path: "manage-subscription/upgrade",
        ele: <UpgradePlan />,
        permission: "",
    },
    {
        path: "compare-plan/:id",
        ele: <ComparePlan />,
        permission: "",
    },
    {
        path: "payment-success",
        ele: <PaymentSuccess />,
        permission: "",
    },
    {
        path: "payment-failed",
        ele: <PaymentFailed />,
        permission: "",
    },
    {
        path: "customer-display",
        ele: <CustomerDisplay />,
        permission: "",
    },
    // {
    //     path: "services",
    //     ele: <Assistances />,
    //     permission: Permissions.MANAGE_ASISTENCES,
    // },
    {
        path: "assistances",
        ele: <Assistances />,
        permission: Permissions.MANAGE_ASISTENCES,
    },
    {
        path: "services/create",
        ele: <CreateAssistance />,
        permission: Permissions.MANAGE_ASISTENCES,
    },
    {
        path: "services/edit/:id",
        ele: <EditAssistance />,
        permission: Permissions.MANAGE_ASISTENCES,
    },
    {
        path: "assistances/:id",
        ele: <AssistancesDetail />,
        permission: Permissions.MANAGE_ASISTENCES,
    },
    {
        path: "assistances-category",
        ele: <AssistanceCategories />,
        permission: Permissions.MANAGE_ASISTENCES,
    }

];

export const adminRoute = [
    {
        path: "dashboard",
        ele: <AdminDashboard />,
        permission: "",
    },
    {
        path: "users",
        ele: <Users />,
        permission: "",
    },
    {
        path: "users/create",
        ele: <CreateAdminUser />,
        permission: "",
    },
    {
        path: "users/edit/:id",
        ele: <EditAdminUser />,
        permission: "",
    },
    {
        path: "users/detail/:id",
        ele: <AdminUserDetail />,
        permission: "",
    },
    {
        path: "subscriptions",
        ele: <Subscriptions />,
        permission: "",
    },
    {
        path: "transactions",
        ele: <Transactions />,
        permission: "",
    },
    {
        path: "cash-payments",
        ele: <CashPayments />,
        permission: "",
    },
    {
        path: "languages",
        ele: <Language />,
        permission: "",
    },
    {
        path: "languages/:id",
        ele: <EditLanguageData />,
        permission: "",
    },
    {
        path: "currencies",
        ele: <Currencies />,
        permission: "",
    },
    {
        path: "plans",
        ele: <Plans />,
        permission: "",
    },
    {
        path: "plans/create",
        ele: <CreatePlan />,
        permission: "",
    },
    {
        path: "plans/edit/:id",
        ele: <EditPlan />,
        permission: "",
    },
    {
        path: "settings",
        ele: <AdminSettings />,
        permission: "",
    },
    {
        path: "front-cms/hero-section",
        ele: <HeroSection />,
        permission: "",
    },
    {
        path: "front-cms/services",
        ele: <Services />,
        permission: "",
    },
    {
        path: "front-cms/services/edit/:id",
        ele: <ServicesForm />,
        permission: "",
    },
    {
        path: "front-cms/partners",
        ele: <Partners />,
        permission: "",
    },
    {
        path: "front-cms/why-choose-us",
        ele: <WhyChooseUs />,
        permission: "",
    },
    {
        path: "front-cms/testimonials",
        ele: <Testimonials />,
        permission: "",
    },
    {
        path: "front-cms/faqs",
        ele: <FAQs />,
        permission: "",
    },
    {
        path: "front-cms/steps",
        ele: <Steps />,
        permission: "",
    },
    // {
    //     path: "mail-settings",
    //     ele: <MailSettings />,
    //     permission: "",
    // },
    {
        path: "payment-settings",
        ele: <PaymentSettings />,
        permission: "",
    },
    {
        path: "profile/edit",
        ele: <UpdateProfile />,
        permission: "",
    },
    {
        path: "front-cms/pages/privacy-policy",
        ele: <PrivacyPolicy />,
        permission: "",
    },
    {
        path: "front-cms/pages/refund-policy",
        ele: <RefundPolicy />,
        permission: "",
    },
    {
        path: "front-cms/pages/terms-conditions",
        ele: <TermsAndConditions />,
        permission: "",
    },
    {
        path: "front-cms/features",
        ele: <Features />,
        permission: "",
    },
    {
        path: "inquiries",
        ele: <Inquiries />,
        permission: "",
    },
]
