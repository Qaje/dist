//API Base URL
export const apiBaseURL = {
    BRANDS: "/brands",
    CURRENCY: "/currencies",
    REGISTRATION: "/register",
    PRODUCTS_CATEGORIES: "/product-categories",
    VARIATIONS: "/variations",
    ROLES: "/roles",
    LANGUAGES: "/languages",
    PERMISSION: "/permissions",
    WAREHOUSES: "/warehouses",
    UNITS: "/units",
    BASE_UNITS: "/base-units",
    SUPPLIERS: "/suppliers",
    SMS_SETTING: "/sms-settings",
    SUPPLIERS_REPORT: "/supplier-report",
    CUSTOMERS_REPORT: "/customer-report",
    CUSTOMERS: "/customers",
    USERS: "/users",
    EXPENSES_CATEGORIES: "/expense-categories",
    EXPENSES: "/expenses",
    MAIN_PRODUCTS: "/main-products",
    PRODUCTS: "/products",
    IMPORT_PRODUCT: "/import-products",
    IMPORT_SUPPLIER: "/import-suppliers",
    IMPORT_CUSTOMERS: "/import-customers",
    PURCHASES: "/purchases",
    TRANSFERS: "/transfers",
    SALES: "/sales",
    QUOTATIONS: "/quotations",
    QUOTATIONS_DETAILS: "quotation-info",
    ADJUSTMENTS: "/adjustments",
    SETTINGS: "/settings",
    CACHE_CLEAR: "/cache-clear",
    CHANGE_PASSWORD: "change-password",
    ADMIN_FORGOT_PASSWORD: "forgot-password",
    ADMIN_RESET_PASSWORD: "reset-password",
    EDIT_PROFILE: "edit-profile",
    UPDATE_PROFILE: "update-profile",
    FRONT_SETTING: "front-setting",
    PRODUCT_IMAGE_DELETE: "products-image-delete",
    CASH_PAYMENT: "sales",
    CHANGE_LANGUAGE: "change-language",
    TODAY_SALE_COUNT: "today-sales-purchases-count",
    RECENT_SALES: "recent-sales",
    TOP_SELLING_PRODUCTS: "top-selling-products",
    WEEK_SALE_PURCHASES_API: "week-selling-purchases",
    YEAR_TOP_PRODUCT: "yearly-top-selling",
    TOP_CUSTOMERS: "top-customers",
    PURCHASE_DETAILS: "purchase-info",
    SALE_DETAILS: "sale-info",
    SALE_RETURN: "sales-return",
    SALE_PDF: "sale-pdf-download",
    QUOTATION_PDF: "quotation-pdf-download",
    SALE_RETURN_PDF: "sale-return-pdf-download",
    PURCHASE_PDF: "purchase-pdf-download",
    PURCHASES_RETURN: "purchases-return",
    SALE_RETURN_DETAILS: "sale-return-info",
    PURCHASES_RETURN_DETAILS: "purchase-return-info",
    PURCHASE_RETURN_PDF: "purchase-return-pdf-download",
    WAREHOUSE_REPORT: "warehouse-report",
    WAREHOUSE_DETAILS: "warehouse-details",
    STOCK_REPORT: "stock-report",
    PRODUCT_STOCK_REPORT: "product-stock-alerts",
    TOP_SELLING_REPORT: "top-selling-product-report",
    STOCK_SALE_TAB: "get-sale-product-report",
    STOCK_SALE_RETURN_TAB: "get-sale-return-product-report",
    STOCK_PURCHASE_TAB: "get-purchase-product-report",
    STOCK_PURCHASE_RETURN_TAB: "get-purchase-return-product-report",
    STOCK_DETAILS_WAREHOUSE: "get-product-count",
    TOP_SELLING_PRODUCT_REPORT: "top-selling-product-report",
    STOCK_ALERT: "stock-alerts",
    VALIDATE_AUTH_TOKEN: "validate-auth-token",
    CONFIG: "config",
    EMAIL_TEMPLATES: "mail-templates",
    SMS_TEMPLATES: "sms-templates",
    SMS_TEMPLATES_STATUS: "sms-template-status",
    EMAIL_TEMPLATES_STATUS: "mail-template-status",
    ALL_SALE_PURCHASE: "all-sales-purchases-count",
    SUPPLIER_PURCHASE_REPORT: "supplier-purchases-report",
    SUPPLIER_PURCHASE_RETURN_REPORT: "supplier-purchases-return-report",
    SUPPLIER_PURCHASE_REPORT_EXCEL: "purchases-report-excel",
    SUPPLIER_PURCHASE_RETURN_EXCEL: "purchases-return-report-excel",
    SUPPLIER_REPORT_WIDGET_DATA: "supplier-report-info",
    BEST_CUSTOMERS_REPORT: "best-customers-report",
    BEST_CUSTOMERS_REPORT_PDF: "best-customers-pdf-download",
    PROFIT_AND_LOSS_REPORT: "profit-loss-report",
    CUSTOMER_REPORT_WIDGET_DATA: "customer-info",
    CUSTOMER_REPORT_PDF: "customer-pdf-download",
    CUSTOMER_QUOTATIONS_REPORT_PDF: "customer-quotations-pdf-download",
    CUSTOMER_SALES_REPORT_PDF: "customer-sales-pdf-download",
    CUSTOMER_SALES_RETURNS_REPORT_PDF: "customer-returns-pdf-download",
    CUSTOMER_PAYMENT_REPORT: "customer-payments-report",
    CUSTOMER_PAYMENT_REPORT_PDF: "customer-payments-pdf-download",
    MAIL_SETTINGS: "mail-settings",
    MAIL_SETTINGS_UPDATE: "mail-settings/update",
    TODAY_SALE_OVERALL_REPORT: "today-sales-overall-report",
    EDIT_SALE_FROM_SALE: "sales-return-edit",
    HOLDS_LIST: "holds",
    REGISTER_CASH_IN_HAND: "register-entry",
    CLOSE_REGISTER: "register-close",
    GET_REGISTER_DETAILS: "get-register-details",
    GET_REGISTER_REPORT_DETAILS: "register-report",
    RECEIPT_SETTINGS: "receipt-settings",
    PLANS: "plans",
    CURRENT_PLAN: "current-plan",
    PAYMENT_METHODS: "payment-methods",
    SUBSCRIPTIONS: "subscriptions",
    COMPARE: "compare",
    CREATE_SUBSCRIPTION: "subscription",
    STRIPE_PAYMENT: "stripe/generate-session",
    PAYPAL_PAYMENT: "paypal/generate-session",
    RAZORPAY_PAYMENT: "razorpay/generate-session",
    STATUS: "users/status",
    STORES: "stores",
    CHANGE_STORES: "change-store",
    CHANGE_STATUS: "change-status",
    PURCHASE_RETURN_EDIT: "purchase-return-edit",
    TAXES: "taxes",
    POS_SETTINGS: "pos-settings",
    FRONT_CMS: "front-cms",
    DUAL_SCREEN_SETTINGS: "dual-screen-settings",
    DUAL_SCREEN_SETTINGS_UPDATE: "dual-screen-settings/update",
    ASSISTANCES: "asistences",
    ASSISTANCE_CATEGORIES: "asistence-categories"
};

export const adminApiBaseURL = {
    DASHBOARD: "sadmin/dashboard",
    TRANSACTIONS: "sadmin/transactions",
    ADMIN_USERS: "sadmin/admin-users",
    EMAIL_VERIFY: "sadmin/admin-users/email-verify",
    STATUS: "sadmin/admin-users/status",
    LANGUAGES: "sadmin/languages",
    PLANS: "sadmin/plans",
    PLAN_DEFAULT: "sadmin/plans/default",
    CURRENCY: "sadmin/currencies",
    MAIL_SETTINGS: "sadmin/mail-settings",
    SUBSCRIPTIONS: "sadmin/subscriptions",
    CASH_PAYMENTS: "sadmin/cash-payments",
    PAYMENT_SETTINGS: "sadmin/payment-settings",
    SETTINGS: "sadmin/settings",
    FRONT_CMS_HERO_SECTION: "sadmin/hero-section",
    FRONT_CMS_SERVICES_SECTION: "sadmin/services",
    PARTNERS: "sadmin/partners",
    FEATURES: "sadmin/features",
    TESTIMONIALS: "sadmin/testimonials",
    FRONT_CMS_WHY_CHOOSE_US: "sadmin/why-choose-us",
    FRONT_CMS_FAQS: "sadmin/faqs",
    PAGES: "sadmin/pages",
    INQURIES: "sadmin/contact-us",
    STEPS: "sadmin/steps",
    CHANGE_USER_PLAN: "sadmin/change-user-plan"
};

export const authActionType = {
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    CHANGE_PASSWORD: "CHANGE_PASSWORD",
    ADMIN_FORGOT_PASSWORD: "ADMIN_FORGOT_PASSWORD",
    ADMIN_RESET_PASSWORD: "ADMIN_RESET_PASSWORD",
};

export const configActionType = {
    FETCH_CONFIG: "FETCH_CONFIG",
    FETCH_ALL_CONFIG: "FETCH_ALL_CONFIG",
};

export const brandsActionType = {
    FETCH_BRANDS: "FETCH_BRANDS",
    FETCH_BRAND: "FETCH_BRAND",
    ADD_BRANDS: "ADD_BRANDS",
    EDIT_BRANDS: "EDIT_BRANDS",
    DELETE_BRANDS: "DELETE_BRANDS",
    FETCH_ALL_BRANDS: "FETCH_ALL_BRANDS",
};

export const bestCustomerActionType = {
    FETCH_BEST_CUSTOMER_REPORT: "FETCH_BEST_CUSTOMER_REPORT",
};

export const emailTemplatesActionType = {
    FETCH_EMAIL_TEMPLATES: "FETCH_EMAIL_TEMPLATES",
    FETCH_EMAIL_TEMPLATE: "FETCH_EMAIL_TEMPLATE",
    EDIT_EMAIL_TEMPLATE: "EDIT_EMAIL_TEMPLATE",
    SET_ACTIVE_DE_ACTIVE: "SET_ACTIVE_DE_ACTIVE",
};

export const smsTemplatesActionType = {
    FETCH_SMS_TEMPLATES: "FETCH_SMS_TEMPLATES",
    FETCH_SMS_TEMPLATE: "FETCH_SMS_TEMPLATE",
    EDIT_SMS_TEMPLATE: "EDIT_SMS_TEMPLATE",
    SET_ACTIVE_DE_ACTIVE: "SET_ACTIVE_DE_ACTIVE",
};

export const expenseActionType = {
    FETCH_EXPENSES: "FETCH_EXPENSES",
    FETCH_EXPENSE: "FETCH_EXPENSE",
    ADD_EXPENSE: "ADD_EXPENSE",
    EDIT_EXPENSE: "EDIT_EXPENSE",
    DELETE_EXPENSE: "DELETE_EXPENSE",
};

export const settingActionType = {
    FETCH_SETTING: "FETCH_SETTING",
    EDIT_SETTINGS: "EDIT_SETTINGS",
    FETCH_CACHE_CLEAR: "FETCH_CACHE_CLEAR",
    FETCH_MAIL_SETTINGS: "FETCH_MAIL_SETTINGS",
    EDIT_MAIL_SETTINGS: "EDIT_MAIL_SETTINGS",
    FETCH_RECEIPT_SETTINGS: "FETCH_RECEIPT_SETTINGS",
    EDIT_RECEIPT_SETTINGS: "EDIT_RECEIPT_SETTINGS",
};

export const taxActionType = {
    FETCH_TAX: "FETCH_TAX",
    ADD_TAX: "ADD_TAX",
    EDIT_TAXES: "EDIT_TAXES",
    DELETE_TAXES: "DELETE_TAXES",
}

export const posSettingActionType = {
    FETCH_POS_SETTING: "FETCH_POS_SETTING",
    EDIT_POS_SETTINGS: "EDIT_POS_SETTINGS",
};

export const dualScreenSettingActionType = {
    FETCH_DUAL_SETTING: "FETCH_DUAL_SETTING",
};

export const storeActionType = {
    FETCH_STORE: "FETCH_STORE",
    ADD_STORE: "ADD_STORE",
    DELETE_STORE: "DELETE_STORE",
};


export const warehouseActionType = {
    FETCH_WAREHOUSES: "FETCH_WAREHOUSES",
    FETCH_WAREHOUSE: "WAREHOUSE",
    ADD_WAREHOUSE: "ADD_WAREHOUSE",
    EDIT_WAREHOUSE: "EDIT_WAREHOUSE",
    DELETE_WAREHOUSE: "DELETE_WAREHOUSE",
    FETCH_ALL_WAREHOUSES: "FETCH_ALL_WAREHOUSES",
    FETCH_WAREHOUSE_REPORT: "FETCH_WAREHOUSE_REPORT",
    FETCH_WAREHOUSE_DETAILS: "FETCH_WAREHOUSE_DETAILS",
};

export const supplierActionType = {
    FETCH_SUPPLIERS: "FETCH_SUPPLIERS",
    FETCH_SUPPLIER: "FETCH_SUPPLIER",
    ADD_SUPPLIER: "ADD_SUPPLIER",
    EDIT_SUPPLIER: "EDIT_SUPPLIER",
    DELETE_SUPPLIER: "DELETE_SUPPLIER",
    FETCH_ALL_SUPPLIERS: "FETCH_ALL_SUPPLIERS",
    FETCH_SUPPLIERS_REPORT: "FETCH_SUPPLIERS_REPORT",
};

export const smsApiActionType = {
    FETCH_SMS_SETTINGS: "FETCH_SMS_SETTINGS",
    EDIT_SMS_SETTING: "EDIT_SMS_SETTING",
};

export const unitsActionType = {
    FETCH_UNITS: "FETCH_UNITS",
    FETCH_UNIT: "FETCH_UNIT",
    ADD_UNIT: "ADD_UNIT",
    EDIT_UNIT: "EDIT_UNIT",
    DELETE_UNIT: "DELETE_UNIT",
};

export const asistancesActionType = {
    CREATE_ASSISTANCE_REQUEST: 'CREATE_ASSISTANCE_REQUEST',
    CREATE_ASSISTANCE_SUCCESS: 'CREATE_ASSISTANCE_SUCCESS',
    CREATE_ASSISTANCE_FAILURE: 'CREATE_ASSISTANCE_FAILURE',
    UPDATE_ASSISTANCE_REQUEST: 'UPDATE_ASSISTANCE_REQUEST',
    UPDATE_ASSISTANCE_SUCCESS: 'UPDATE_ASSISTANCE_SUCCESS',
    UPDATE_ASSISTANCE_FAILURE: 'UPDATE_ASSISTANCE_FAILURE',
    FETCH_ASSISTANCE_DETAIL_REQUEST: 'FETCH_ASSISTANCE_DETAIL_REQUEST',
    FETCH_ASSISTANCE_DETAIL_SUCCESS: 'FETCH_ASSISTANCE_DETAIL_SUCCESS',
    FETCH_ASSISTANCE_DETAIL_FAILURE: 'FETCH_ASSISTANCE_DETAIL_FAILURE',

    // Operaciones básicas (similar al ejemplo de productos)
    FETCH_ASSISTANCES: 'FETCH_ASSISTANCES',
    FETCH_ASSISTANCE: 'FETCH_ASSISTANCE',
    ADD_ASSISTANCE: 'ADD_ASSISTANCE',
    EDIT_ASSISTANCE: 'EDIT_ASSISTANCE',
    DELETE_ASSISTANCE: 'DELETE_ASSISTANCE',

    // Versión con estados de carga
    FETCH_ASSISTANCES_REQUEST: 'FETCH_ASSISTANCES_REQUEST',
    FETCH_ASSISTANCES_SUCCESS: 'FETCH_ASSISTANCES_SUCCESS',
    FETCH_ASSISTANCES_FAILURE: 'FETCH_ASSISTANCES_FAILURE',
    ADD_ASSISTANCE_REQUEST: 'ADD_ASSISTANCE_REQUEST',
    ADD_ASSISTANCE_SUCCESS: 'ADD_ASSISTANCE_SUCCESS',
    ADD_ASSISTANCE_FAILURE: 'ADD_ASSISTANCE_FAILURE',
    EDIT_ASSISTANCE_REQUEST: 'EDIT_ASSISTANCE_REQUEST',
    EDIT_ASSISTANCE_SUCCESS: 'EDIT_ASSISTANCE_SUCCESS',
    EDIT_ASSISTANCE_FAILURE: 'EDIT_ASSISTANCE_FAILURE',
    DELETE_ASSISTANCE_REQUEST: 'DELETE_ASSISTANCE_REQUEST',
    DELETE_ASSISTANCE_SUCCESS: 'DELETE_ASSISTANCE_SUCCESS',
    DELETE_ASSISTANCE_FAILURE: 'DELETE_ASSISTANCE_FAILURE',

    FETCH_ALL_ASSISTANCES: 'FETCH_ALL_ASSISTANCES',
    POS_ALL_ASSISTANCE: 'POS_ALL_ASSISTANCE',
    POS_ALL_ASSISTANCES: 'POS_ALL_ASSISTANCES',
    FETCH_ASSISTANCE_CLICKABLE: 'FETCH_ASSISTANCE_CLICKABLE',
    RESET_ASSISTANCE: 'RESET_ASSISTANCE',


};

export const assistanceCategoriesActionType = {

    FETCH_ASSISTANCE_CATEGORY_SUCCESS: 'FETCH_ASSISTANCE_CATEGORY_SUCCESS',
    FETCH_ASSISTANCE_CATEGORY_DETAIL_SUCCESS: 'FETCH_ASSISTANCE_CATEGORY_DETAIL_SUCCESS',

    ADD_ASSISTANCE_CATEGORY_REQUEST: 'ADD_ASSISTANCE_CATEGORY_REQUEST',
    ADD_ASSISTANCE_CATEGORY_SUCCESS: 'ADD_ASSISTANCE_CATEGORY_SUCCESS',
    ADD_ASSISTANCE_CATEGORY_FAILURE: 'ADD_ASSISTANCE_CATEGORY_FAILURE',

    EDIT_ASSISTANCE_CATEGORY_SUCCESS: 'EDIT_ASSISTANCE_CATEGORY_SUCCESS',
    EDIT_ASSISTANCE_CATEGORY_FAILURE: 'EDIT_ASSISTANCE_CATEGORY_FAILURE',

    DELETE_ASSISTANCE_CATEGORY_SUCCESS: 'DELETE_ASSISTANCE_CATEGORY_SUCCESS',
    DELETE_ASSISTANCE_CATEGORY_FAILURE: 'DELETE_ASSISTANCE_CATEGORY_FAILURE',

    CREATE_ASSISTANCE_CATEGORY_REQUEST: 'CREATE_ASSISTANCE_CATEGORY_REQUEST',
    CREATE_ASSISTANCE_CATEGORY_SUCCESS: 'CREATE_ASSISTANCE_CATEGORY_SUCCESS',
    CREATE_ASSISTANCE_CATEGORY_FAILURE: 'CREATE_ASSISTANCE_CATEGORY_FAILURE',
    UPDATE_ASSISTANCE_CATEGORY_REQUEST: 'UPDATE_ASSISTANCE_CATEGORY_REQUEST',
    UPDATE_ASSISTANCE_CATEGORY_SUCCESS: 'UPDATE_ASSISTANCE_CATEGORY_SUCCESS',
    UPDATE_ASSISTANCE_CATEGORY_FAILURE: 'UPDATE_ASSISTANCE_CATEGORY_FAILURE',
    FETCH_ASSISTANCE_CATEGORY_DETAIL_REQUEST: 'FETCH_ASSISTANCE_CATEGORY_DETAIL_REQUEST',
    //FETCH_ASSISTANCE_CATEGORY_DETAIL_SUCCESS: 'FETCH_ASSISTANCE_CATEGORY_DETAIL_SUCCESS',
    FETCH_ASSISTANCE_CATEGORY_DETAIL_FAILURE: 'FETCH_ASSISTANCE_CATEGORY_DETAIL_FAILURE',

    // Operaciones básicas (similar al ejemplo de productos)
    FETCH_ASSISTANCE_CATEGORIES: 'FETCH_ASSISTANCE_CATEGORIES',
    FETCH_ASSISTANCE_CATEGORY: 'FETCH_ASSISTANCE_CATEGORY',
    ADD_ASSISTANCE_CATEGORY: 'ADD_ASSISTANCE_CATEGORY',
    EDIT_ASSISTANCE_CATEGORY: 'EDIT_ASSISTANCE_CATEGORY',
    DELETE_ASSISTANCE_CATEGORY: 'DELETE_ASSISTANCE_CATEGORY',

    // Versión con estados de carga
    FETCH_ASSISTANCE_CATEGORIES_REQUEST: 'FETCH_ASSISTANCE_CATEGORIES_REQUEST',
    FETCH_ASSISTANCE_CATEGORIES_SUCCESS: 'FETCH_ASSISTANCE_CATEGORIES_SUCCESS',
    //FETCH_ASSISTANCE_CATEGORY_SUCCESS: 'FETCH_ASSISTANCE_CATEGORY_SUCCESS',
    FETCH_ASSISTANCE_CATEGORIES_FAILURE: 'FETCH_ASSISTANCE_CATEGORIES_FAILURE',
    //ADD_ASSISTANCE_CATEGORY_REQUEST: 'ADD_ASSISTANCE_CATEGORY_REQUEST',
    //ADD_ASSISTANCE_CATEGORY_SUCCESS: 'ADD_ASSISTANCE_CATEGORY_SUCCESS',
    //ADD_ASSISTANCE_CATEGORY_FAILURE: 'ADD_ASSISTANCE_CATEGORY_FAILURE',
    EDIT_ASSISTANCE_CATEGORY_REQUEST: 'EDIT_ASSISTANCE_CATEGORY_REQUEST',
    //EDIT_ASSISTANCE_CATEGORY_SUCCESS: 'EDIT_ASSISTANCE_CATEGORY_SUCCESS',
    //EDIT_ASSISTANCE_CATEGORY_FAILURE: 'EDIT_ASSISTANCE_CATEGORY_FAILURE',
    DELETE_ASSISTANCE_CATEGORY_REQUEST: 'DELETE_ASSISTANCE_CATEGORY_REQUEST',
    //DELETE_ASSISTANCE_CATEGORY_SUCCESS: 'DELETE_ASSISTANCE_CATEGORY_SUCCESS',
    //DELETE_ASSISTANCE_CATEGORY_FAILURE: 'DELETE_ASSISTANCE_CATEGORY_FAILURE',

    FETCH_ALL_ASSISTANCE_CATEGORIES: 'FETCH_ALL_ASSISTANCES',
    //POS_ALL_ASSISTANCE_CATEGORIES: 'POS_ALL_ASSISTANCE_CATEGORY',
    POS_ALL_ASSISTANCE_CATEGORIES: 'POS_ALL_ASSISTANCE_CATEGORIES',
    FETCH_ASSISTANCE_CATEGORY_CLICKABLE: 'FETCH_ASSISTANCE_CATEGORY_CLICKABLE',
    RESET_ASSISTANCE_CATEGORY: 'RESET_ASSISTANCE_CATEGORY',

    //FETCH_ASSISTANCE_CATEGORY_DETAIL_SUCCESS: 'FETCH_ASSISTANCE_CATEGORY_DETAIL_SUCCESS',


};

export const assistanceTypes = {
    SERVICE: 1,
    CONSULTATION: 2,
    MAINTENANCE: 3,
    REPAIR: 4,
    INSTALLATION: 5,
    CLEANING: 6,
    INSPECTION: 7,
    TRAINING: 8,
    SUPPORT: 9,
    OTHER: 10,
};

export const assistanceStatus = {
    AVAILABLE: 1,
    UNAVAILABLE: 2,
    MAINTENANCE: 3,
    DISCONTINUED: 4,
};

export const assistanceDurationUnits = {
    MINUTES: 'minutes',
    HOURS: 'hours',
    DAYS: 'days',
    WEEKS: 'weeks',
};

export const baseUnitsActionType = {
    FETCH_UNITS: "FETCH_UNITS",
    FETCH_UNIT: "FETCH_UNIT",
    ADD_UNIT: "ADD_UNIT",
    EDIT_UNIT: "EDIT_UNIT",
    DELETE_UNIT: "DELETE_UNIT",
    FETCH_ALL_BASE_UNITS: "FETCH_ALL_BASE_UNITS",
};

export const productUnitActionType = {
    PRODUCT_UNITS: "PRODUCT_UNITS",
};

export const rolesActionType = {
    FETCH_ROLES: "FETCH_ROLES",
    FETCH_ROLE: "FETCH_ROLE",
    ADD_ROLES: "ADD_ROLES",
    EDIT_ROLES: "EDIT_ROLES",
    DELETE_ROLES: "DELETE_ROLES",
    FETCH_ALL_ROLES: "FETCH_ALL_ROLES",
};

export const languagesActionType = {
    FETCH_LANGUAGES: "FETCH_LANGUAGES",
    FETCH_LANGUAGE: "FETCH_LANGUAGE",
    ADD_LANGUAGE: "ADD_LANGUAGE",
    EDIT_LANGUAGE: "EDIT_LANGUAGE",
    DELETE_LANGUAGE: "DELETE_LANGUAGE",
    FETCH_ALL_LANGUAGES: "FETCH_ALL_LANGUAGES",
    EDIT_LANGUAGE_DATA: "EDIT_LANGUAGE_DATA",
    FETCH_LANGUAGE_DATA: "FETCH_LANGUAGE_DATA",
};

export const productImageActionType = {
    DELETE_PRODUCT_IMAGE: "DELETE_PRODUCT_IMAGE",
};

export const purchaseActionType = {
    FETCH_PURCHASES: "FETCH_PURCHASES",
    FETCH_PURCHASE: "FETCH_PURCHASE",
    ADD_PURCHASE: "ADD_PURCHASE",
    EDIT_PURCHASE: "EDIT_PURCHASE",
    DELETE_PURCHASE: "DELETE_PURCHASE",
    PURCHASE_DETAILS: "PURCHASE_DETAILS",
    PURCHASE_PDF_ACTION: "PURCHASE_PDF_ACTION",
};

export const transferActionType = {
    FETCH_TRANSFERS: "FETCH_TRANSFERS",
    FETCH_TRANSFER: "FETCH_TRANSFER",
    ADD_TRANSFER: "ADD_TRANSFER",
    EDIT_TRANSFER: "EDIT_TRANSFER",
    DELETE_TRANSFER: "DELETE_TRANSFER",
    TRANSFER_DETAILS: "TRANSFER_DETAILS",
    TRANSFER_PDF_ACTION: "TRANSFER_PDF_ACTION",
};

export const purchaseReturnActionType = {
    FETCH_PURCHASES_RETURN: "FETCH_PURCHASES_RETURN",
    FETCH_PURCHASE_RETURN: "FETCH_PURCHASE_RETURN",
    ADD_PURCHASE_RETURN: "ADD_PURCHASE_RETURN",
    EDIT_PURCHASE_RETURN: "EDIT_PURCHASE_RETURN",
    DELETE_PURCHASE_RETURN: "DELETE_PURCHASE_RETURN",
    PURCHASES_RETURN_DETAILS: "PURCHASES_RETURN_DETAILS",
};

export const purchaseProductActionType = {
    SEARCH_PURCHASE_PRODUCTS: "SEARCH_PURCHASE_PRODUCTS",
};

export const permissionActionType = {
    FETCH_PERMISSIONS: "FETCH_PERMISSIONS",
};

export const currencyActionType = {
    FETCH_CURRENCIES: "FETCH_CURRENCIES",
    FETCH_CURRENCY: "FETCH_CURRENCY",
    ADD_CURRENCY: "ADD_CURRENCY",
    EDIT_CURRENCY: "EDIT_CURRENCY",
    DELETE_CURRENCY: "DELETE_CURRENCY",
};

export const userActionType = {
    FETCH_USERS: "FETCH_USERS",
    FETCH_USER: "FETCH_USER",
    ADD_USER: "ADD_USER",
    EDIT_USER: "EDIT_USER",
    DELETE_USER: "DELETE_USER",
};

export const languageActionType = {
    UPDATE_LANGUAGE: "UPDATE_LANGUAGE",
    UPDATED_LANGUAGE: "UPDATED_LANGUAGE",
};

export const profileActionType = {
    FETCH_PROFILE: "FETCH_PROFILE",
    UPDATE_PROFILE: "UPDATE_PROFILE",
};

export const productCategoriesActionType = {
    FETCH_PRODUCTS_CATEGORIES: "FETCH_PRODUCTS_CATEGORIES",
    FETCH_PRODUCT_CATEGORIES: "FETCH_PRODUCT_CATEGORIES",
    ADD_PRODUCT_CATEGORIES: "ADD_PRODUCT_CATEGORIES",
    EDIT_PRODUCT_CATEGORIES: "EDIT_PRODUCT_CATEGORIES",
    DELETE_PRODUCT_CATEGORIES: "DELETE_PRODUCT_CATEGORIES",
    FETCH_ALL_PRODUCTS_CATEGORIES: "FETCH_ALL_PRODUCTS_CATEGORIES",
};

export const variationActionType = {
    FETCH_VARIATIONS: "FETCH_VARIATIONS",
    FETCH_VARIATION: "FETCH_VARIATION",
    ADD_VARIATION: "ADD_VARIATION",
    EDIT_VARIATION: "EDIT_VARIATION",
    DELETE_VARIATION: "DELETE_VARIATION",
    FETCH_ALL_VARIATIONS: "FETCH_ALL_VARIATIONS",
};

export const expenseCategoriesActionType = {
    FETCH_EXPENSES_CATEGORIES: "FETCH_EXPENSES_CATEGORIES",
    FETCH_EXPENSE_CATEGORIES: "FETCH_EXPENSE_CATEGORIES",
    ADD_EXPENSE_CATEGORIES: "ADD_EXPENSE_CATEGORIES",
    EDIT_EXPENSE_CATEGORIES: "EDIT_EXPENSE_CATEGORIES",
    DELETE_EXPENSE_CATEGORIES: "DELETE_EXPENSE_CATEGORIES",
    FETCH_ALL_EXPENSES_CATEGORIES: "FETCH_ALL_EXPENSES_CATEGORIES",
};

export const frontSettingActionType = {
    FETCH_FRONT_SETTING: "FETCH_FRONT_SETTING",
};

export const frontCmsActionType = {
    FETCH_FRONT_CMS: "FETCH_FRONT_CMS",
};

export const tokenValidationActionType = {
    FETCH_VALIDATION: "FETCH_VALIDATION",
};

export const customerActionType = {
    FETCH_CUSTOMERS: "FETCH_CUSTOMERS",
    FETCH_CUSTOMER: "FETCH_CUSTOMER",
    ADD_CUSTOMER: "ADD_CUSTOMER",
    EDIT_CUSTOMER: "EDIT_CUSTOMER",
    DELETE_CUSTOMER: "DELETE_CUSTOMER",
    FETCH_ALL_CUSTOMER: "FETCH_ALL_CUSTOMER",
    FETCH_CUSTOMERS_REPORT: "FETCH_CUSTOMERS_REPORT",
    FETCH_CUSTOMERS_PAYMENT_REPORT: "FETCH_CUSTOMERS_PAYMENT_REPORT",
};

export const todaySalePurchaseCountActionType = {
    TODAY_SALE_COUNT: "TODAY_SALE_COUNT",
};

export const dashboardActionType = {
    FETCH_ALL_SALE_PURCHASE: "FETCH_ALL_SALE_PURCHASE",
};

export const saleActionType = {
    FETCH_SALES: "FETCH_SALES",
    FETCH_SALE: "FETCH_SALE",
    ADD_SALE: "ADD_SALE",
    EDIT_SALE: "EDIT_SALE",
    DELETE_SALE: "DELETE_SALE",
    SEARCH_SALE_PRODUCTS: "SEARCH_SALE_PRODUCTS",
    PRODUCT_SALES_UNIT: "PRODUCT_SALES_UNIT",
    SALE_DETAILS: "SALE_DETAILS",
    SALE_PDF: "SALE_PDF",
    FILTER_STATUS_FILED: "FILTER_STATUS_FILED",
    FILTER_PAYMENT_STATUS_FILED: "FILTER_PAYMENT_STATUS_FILED",
    CREATE_SALE_PAYMENT: "CREATE_SALE_PAYMENT",
    FETCH_SALE_PAYMENT: "FETCH_SALE_PAYMENT",
    EDIT_SALE_PAYMENT: "EDIT_SALE_PAYMENT",
    DELETE_SALE_PAYMENT: "DELETE_SALE_PAYMENT",
};

export const holdListActionType = {
    FETCH_HOLDS: "FETCH_HOLDS",
    ADD_HOLD: "ADD_HOLD",
    FETCH_HOLD: "FETCH_HOLD",
    DELETE_HOLD: "DELETE_HOLD",

    EDIT_SALE: "EDIT_SALE",
    DELETE_SALE: "DELETE_SALE",
    SEARCH_SALE_PRODUCTS: "SEARCH_SALE_PRODUCTS",
    PRODUCT_SALES_UNIT: "PRODUCT_SALES_UNIT",
    SALE_DETAILS: "SALE_DETAILS",
    SALE_PDF: "SALE_PDF",
    FILTER_STATUS_FILED: "FILTER_STATUS_FILED",
    FILTER_PAYMENT_STATUS_FILED: "FILTER_PAYMENT_STATUS_FILED",
    CREATE_SALE_PAYMENT: "CREATE_SALE_PAYMENT",
    FETCH_SALE_PAYMENT: "FETCH_SALE_PAYMENT",
    EDIT_SALE_PAYMENT: "EDIT_SALE_PAYMENT",
    DELETE_SALE_PAYMENT: "DELETE_SALE_PAYMENT",
};

export const quotationActionType = {
    FETCH_QUOTATIONS: "FETCH_QUOTATIONS",
    FETCH_QUOTATION: "FETCH_QUOTATION",
    ADD_QUOTATION: "ADD_QUOTATION",
    EDIT_QUOTATION: "EDIT_QUOTATION",
    DELETE_QUOTATION: "DELETE_QUOTATION",
    SEARCH_SALE_PRODUCTS: "SEARCH_SALE_PRODUCTS",
    PRODUCT_SALES_UNIT: "PRODUCT_SALES_UNIT",
    QUOTATION_DETAILS: "QUOTATION_DETAILS",
    QUOTATION_PDF: "QUOTATION_PDF",
    FILTER_STATUS_FILED: "FILTER_STATUS_FILED",
    FILTER_PAYMENT_STATUS_FILED: "FILTER_PAYMENT_STATUS_FILED",
    CREATE_SALE_PAYMENT: "CREATE_SALE_PAYMENT",
    FETCH_SALE_PAYMENT: "FETCH_SALE_PAYMENT",
    EDIT_SALE_PAYMENT: "EDIT_SALE_PAYMENT",
    DELETE_SALE_PAYMENT: "DELETE_SALE_PAYMENT",
};

export const adjustMentActionType = {
    FETCH_ADJUSTMENTS: "FETCH_ADJUSTMENTS",
    FETCH_ADJUSTMENT: "FETCH_ADJUSTMENT",
    ADD_ADJUSTMENTS: "ADD_ADJUSTMENTS",
    EDIT_ADJUSTMENTS: "EDIT_ADJUSTMENTS",
    DELETE_ADJUSTMENT: "DELETE_ADJUSTMENT",
    ADJUSTMENT_DETAILS: "ADJUSTMENT_DETAILS",
};

export const adminActionType = {
    FETCH_ADMIN_DASHBOARD: "FETCH_ADMIN_DASHBOARD",
    FETCH_TRANSACTION: "FETCH_TRANSACTION",
    FETCH_ADMIN_USERS: "FETCH_ADMIN_USERS",
    FETCH_PLANS: "FETCH_PLANS",
    FETCH_PLAN: "FETCH_PLAN",
    DELETE_PLAN: "DELETE_PLAN",
    ADD_USER: "ADD_USER",
    FETCH_USER: "FETCH_USER",
    DELETE_USER: "DELETE_USER",
    FETCH_SUBSCRIPTIONS: "FETCH_SUBSCRIPTIONS",
    FETCH_CASH_PAYMENTS: "FETCH_CASH_PAYMENTS",
    USER_VERIFY_EMAIL: "USER_VERIFY_EMAIL",
    FETCH_PAYMENT_SETTINGS: "FETCH_PAYMENT_SETTINGS",
    SETTINGS: "SETTINGS",
    FETCH_HERO_SECTION: "FETCH_HERO_SECTION",
    FETCH_SERVICES_SECTION: "FETCH_SERVICES_SECTION",
    FETCH_PARTNERS: "FETCH_PARTNERS",
    FETCH_FEATURES: "FETCH_FEATURES",
    FETCH_TESTIMONIALS: "FETCH_TESTIMONIALS",
    FETCH_WHY_CHOOSE_US: "FETCH_WHY_CHOOSE_US",
    FETCH_FAQS: "FETCH_FAQS",
    FETCH_PAGES: "FETCH_PAGES",
    FETCH_INQUIRIES: "FETCH_INQUIRIES",
    FETCH_STEPS: "FETCH_STEPS",
    //FETCH_STEPS: "FETCH_STEPS",
    CHANGE_USER_PLAN: "CHANGE_USER_PLAN",
};

export const plansActionType = {
    FETCH_PLANS: "FETCH_PLANS",
    FETCH_USER_CURRENT_PLAN: "FETCH_USER_CURRENT_PLAN",
    FETCH_PAYMENT_METHODS: "FETCH_PAYMENT_METHODS",
    FETCH_USER_SUBSCRIPTIONS: "FETCH_USER_SUBSCRIPTIONS",
    COMPARE_PLANS: "COMPARE_PLANS",
};

export const saleReturnActionType = {
    FETCH_SALES_RETURN: "FETCH_SALES_RETURN",
    FETCH_SALE_RETURN: "FETCH_SALE_RETURN",
    ADD_SALE_RETURN: "ADD_SALE_RETURN",
    EDIT_SALE_RETURN: "EDIT_SALE",
    DELETE_SALE_RETURN: "DELETE_SALE_RETURN",
    SEARCH_SALE_PRODUCTS: "SEARCH_SALE_PRODUCTS",
    PRODUCT_SALES_UNIT: "PRODUCT_SALES_UNIT",
    SALE_DETAILS: "SALE_DETAILS",
    FETCH_SALE_RETURN_DETAILS: "FETCH_SALE_RETURN_DETAILS",
};

export const recentSaleActionType = {
    RECENT_SALES: "RECENT_SALES",
};

export const stockReportActionType = {
    STOCK_REPORT: "STOCK_REPORT",
    STOCK_DETAILS_SALE_TAB: "STOCK_DETAILS_SALE_TAB",
    STOCK_DETAILS_SALE_RETURN_TAB: "STOCK_DETAILS_SALE_RETURN_TAB",
    STOCK_DETAILS_PURCHASE_TAB: "STOCK_DETAILS_PURCHASE_TAB",
    STOCK_DETAILS_PURCHASE_RETURN_TAB: "STOCK_DETAILS_PURCHASE_RETURN_TAB",
    STOCK_DETAILS_WAREHOUSE: "STOCK_DETAILS_WAREHOUSE",
};

export const supplierReportActionType = {
    FETCH_SUPPLIER_PURCHASE_REPORT: "FETCH_SUPPLIER_PURCHASE_REPORT",
    FETCH_SUPPLIER_PURCHASE_RETURN: "FETCH_SUPPLIER_PURCHASE_RETURN",
    FETCH_SUPPLIER_WIDGET_DATA: "FETCH_SUPPLIER_WIDGET_DATA",
};

export const customerReportActionType = {
    FETCH_CUSTOMER_WIDGET_DATA: "FETCH_CUSTOMER_WIDGET_DATA",
};

export const productQuantityReportActionType = {
    QUANTITY_REPORT: "QUANTITY_REPORT",
};

export const profitAndLossReportActionType = {
    FETCH_PROFIT_AND_LOSS: "FETCH_PROFIT_AND_LOSS",
};

export const topSellingActionType = {
    TOP_SELLING: "TOP_SELLING",
    TOP_SELLING_REPORT: "TOP_SELLING_REPORT",
};

export const topCustomersActionType = {
    TOP_CUSTOMERS: "TOP_CUSTOMERS",
    FETCH_STOCK_ALERT: "FETCH_STOCK_ALERT",
};

export const weekSalePurchasesActionType = {
    WEEK_SALE_PURCHASES: "WEEK_SALE_PURCHASES",
};

export const yearTopProductActionType = {
    YEAR_TOP_PRODUCT: "YEAR_TOP_PRODUCT",
};

export const Filters = {
    PAGE: 1,
    OBJ: {
        order_By: "",
        page: 1,
        pageSize: 10,
        direction: "asc",
        search: "",
        adminName: "admin",
        categoryId: "",
        created_at: "created_at",
        status: "",
        payment_status: "",
        payment_type: "",
        product_unit: "",
        base_unit: "",
        brand_id: "",
        product_category_id: "",
    },
};

export const constants = {
    SET_TOTAL_RECORD: "SET_TOTAL_RECORD",
    UPDATE_TOTAL_RECORD_AFTER_DELETE: "UPDATE_TOTAL_RECORD_AFTER_DELETE",
    UPDATE_TOTAL_RECORD_AFTER_ADD: "UPDATE_TOTAL_RECORD_AFTER_ADD",
    IS_LOADING: "IS_LOADING",
    SET_LANGUAGE: "SET_LANGUAGE",
    DATE_ACTION: "DATE_ACTION",
    CALL_SALE_API: "CALL_SALE_API",
    CALL_IMPORT_PRODUCT_API: "CALL_IMPORT_PRODUCT_API",
    SET_PRODUCT_UNIT_ID: "SET_PRODUCT_UNIT_ID",
    SET_DATE_FORMAT: "SET_DATE_FORMAT",
    CALL_UPDATE_BRAND_API: "CALL_UPDATE_BRAND_API",
    SET_SAVING: "SET_SAVING",
    SET_DEFAULT_COUNTRY: "SET_DEFAULT_COUNTRY",
};

export const dateLabelSelector = {
    CLEAN: "clean",
    TODAY: "today",
    THIS_WEEK: "this_week",
    LAST_WEEK: "last_week",
    THIS_MONTH: "this_month",
    LAST_MONTH: "last_month",
    CUSTOM: "custom",
};

export const dateFormat = {
    DEFAULT_MOMENT: "YYYY-MM-DD hh:mm:ss",
    NATIVE: "YYYY-MM-DD",
    CHART_DATE: "YYYY/MM/DD",
    CHART_CUSTOM_DATE: "MMM_YYYY",
};

export const toastType = {
    ADD_TOAST: "ADD_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
    ERROR: "error",
};

export const Tokens = {
    ADMIN: "auth_token",
    USER: "user",
    FIRST_NAME: "first_name",
    LAST_NAME: "last_name",
    IMAGE: "image",
    REGISTER_USER: "register_user",
    GET_PERMISSIONS: "get_permissions",
    USER_IMAGE_URL: "user_image_url",
    UPDATED_EMAIL: "updated_email",
    UPDATED_FIRST_NAME: "updated_first_name",
    UPDATED_LAST_NAME: "updated_last_name",
    LANGUAGE: "language",
    UPDATED_LANGUAGE: "updated_language",
};

export const errorMessage = {
    TOKEN_NOT_PROVIDED: "Token not provided",
    TOKEN_EXPIRED: "Token has expired",
    TOKEN_INVALID:
        "Could not decode token: Error while decoding to JSON: Syntax error",
    TOKEN_INVALID_SIGNATURE: "Token Signature could not be verified.",
};

export const Permissions = {
    MANAGE_DASHBOARD: "manage_dashboard",
    MANAGE_ROLES: "manage_roles",
    MANAGE_BRANDS: "manage_brands",
    MANAGE_CURRENCY: "manage_currency",
    MANAGE_WAREHOUSES: "manage_warehouses",
    MANAGE_UNITS: "manage_units",
    MANAGE_PRODUCT_CATEGORIES: "manage_product_categories",
    MANAGE_VARIATIONS: "manage_variations",
    MANAGE_PRODUCTS: "manage_products",
    MANAGE_SUPPLIERS: "manage_suppliers",
    MANAGE_CUSTOMERS: "manage_customers",
    MANAGE_USER: "manage_users",
    MANAGE_EXPENSES_CATEGORIES: "manage_expense_categories",
    MANAGE_EXPENSES: "manage_expenses",
    MANAGE_SETTING: "manage_setting",
    MANAGE_PURCHASE: "manage_purchase",
    MANAGE_PURCHASE_RETURN: "manage_purchase_return",
    MANAGE_POS_SCREEN: "manage_pos_screen",
    MANAGE_SALE: "manage_sale",
    MANAGE_SALE_RETURN: "manage_sale_return",
    MANAGE_REPORT: "manage_report",
    MANAGE_PRINT_BARCODE: "manage_print_barcode",
    MANAGE_ADJUSTMENTS: "manage_adjustments",
    MANAGE_TRANSFERS: "manage_transfers",
    MANAGE_REPORTS: "manage_reports",
    MANAGE_EMAIL_TEMPLATES: "manage_email_templates",
    MANAGE_QUOTATION: "manage_quotations",
    MANAGE_SMS_API: "manage_sms_apis",
    MANAGE_SMS_TEMPLATES: "manage_sms_templates",
    MANAGE_LANGUAGES: "manage_language",
    MANAGE_STORE: "manage_store",
    MANAGE_ASISTENCES: "manage_asistences",
};

//POS Screen Constants
export const productActionType = {
    FETCH_PRODUCTS: "FETCH_PRODUCTS",
    FETCH_PRODUCT: "FETCH_PRODUCT",
    ADD_PRODUCT: "ADD_PRODUCT",
    EDIT_PRODUCT: "EDIT_PRODUCT",
    DELETE_PRODUCT: "DELETE_PRODUCT",
    FETCH_BRAND_CLICKABLE: "FETCH_BRAND_CLICKABLE",
    FETCH_ALL_PRODUCTS: "FETCH_ALL_PRODUCTS",
    FETCH_PRODUCTS_BY_WAREHOUSE: "FETCH_PRODUCTS_BY_WAREHOUSE",
    REMOVE_ALL_PRODUCTS: "REMOVE_ALL_PRODUCTS",
    ADD_IMPORT_PRODUCT: "ADD_IMPORT_PRODUCT",
    FETCH_ALL_MAIN_PRODUCTS: "FETCH_ALL_MAIN_PRODUCTS",
    FETCH_MAIN_PRODUCT: "FETCH_MAIN_PRODUCT",
    ADD_MAIN_PRODUCT: "ADD_MAIN_PRODUCT",
    EDIT_MAIN_PRODUCT: "EDIT_MAIN_PRODUCT",
    DELETE_MAIN_PRODUCT: "DELETE_MAIN_PRODUCT",
    RESET_PRODUCT: "RESET_PRODUCT",
};

export const posProductActionType = {
    FETCH_PRODUCT: "FETCH_PRODUCT",
    POS_ALL_PRODUCT: "POS_ALL_PRODUCT",
    POS_ALL_PRODUCTS: "POS_ALL_PRODUCTS",
    POS_SEARCH_NAME_PRODUCT: "POS_SEARCH_NAME_PRODUCT",
    POS_SEARCH_CODE_PRODUCT: "POS_SEARCH_CODE_PRODUCT",
    FETCH_TODAY_SALE_OVERALL_REPORT: "FETCH_TODAY_SALE_OVERALL_REPORT",
};

export const posRegisterDetailsAction = {
    GET_REGISTER_DETAILS: "GET_REGISTER_DETAILS",
};

export const posRegisterReportDetailsAction = {
    GET_REGISTER_REPORT_DETAILS: "GET_REGISTER_REPORT_DETAILS",
};

export const posCashPaymentActionType = {
    POS_CASH_PAYMENT: "POS_CASH_PAYMENT",
};

export const settingsKey = {
    LANGUAGE: "language",
    DEFAULT_LOCALE: "en",
    LOCALE_ARABIC: "ar",
    LOCALE_PERSIAN: "pe",
    LOCAL_GERMAN: "gr",
};

export const baseUnitOptions = [
    { id: 0, name: "unit.filter.all.label" },
    { id: 1, name: "unit.filter.piece.label" },
    { id: 2, name: "unit.filter.meter.label" },
    { id: 3, name: "unit.filter.kilogram.label" },
];

export const statusOptions = [
    { id: 0, name: "unit.filter.all.label" },
    { id: 1, name: "status.filter.received.label" },
    { id: 2, name: "status.filter.pending.label" },
    { id: 3, name: "status.filter.ordered.label" },
];

export const saleStatusOptions = [
    { id: 1, name: "status.filter.complated.label" },
    { id: 2, name: "status.filter.pending.label" },
    { id: 3, name: "status.filter.ordered.label" },
];

export const purchaseStatusOptions = [
    { id: 1, name: "status.filter.received.label" },
    { id: 2, name: "status.filter.pending.label" },
    { id: 3, name: "status.filter.ordered.label" },
];

export const salePaymentStatusOptions = [
    { id: 1, name: "globally.detail.paid" },
    { id: 2, name: "payment-status.filter.unpaid.label" },
];

export const purchasePaymentStatusOptions = [
    { id: 1, name: "globally.detail.paid" },
    { id: 2, name: "payment-status.filter.unpaid.label" },
    { id: 3, name: "payment-status.filter.partial.label" },
];

export const paymentStatusOptions = [
    { id: 0, name: "unit.filter.all.label" },
    { id: 1, name: "globally.detail.paid" },
    { id: 2, name: "payment-status.filter.unpaid.label" },
    { id: 3, name: "payment-status.filter.partial.label" },
];

export const unitOptions = [
    { id: 1, name: "unit.filter.piece.label" },
    { id: 2, name: "unit.filter.meter.label" },
    { id: 3, name: "unit.filter.kilogram.label" },
];

export const paymentMethodOptions = [
    { id: 1, name: "cash.label" },
    { id: 2, name: "payment-type.filter.cheque.label" },
    { id: 3, name: "payment-type.filter.bank-transfer.label" },
    { id: 4, name: "payment-type.filter.other.label" },
];

export const paymentTypeOptions = [
    { id: 0, name: "unit.filter.all.label" },
    { id: 1, name: "cash.label" },
    { id: 2, name: "payment-type.filter.cheque.label" },
    { id: 3, name: "payment-type.filter.bank-transfer.label" },
    { id: 4, name: "payment-type.filter.other.label" },
];

export const taxMethodOptions = [
    { id: 1, name: "tax-type.filter.exclusive.label" },
    { id: 2, name: "tax-type.filter.inclusive.label" },
];

export const productTypesOptions = [
    { id: 1, name: "products.type.single-type.label" },
    { id: 2, name: "variation.title" },
];

export const discountMethodOptions = [
    { id: 1, name: "discount-type.filter.percentage.label" },
    { id: 2, name: "discount-type.filter.fixed.label" },
];

export const discountType = {
    PERCENTAGE: 1,
    FIXED: 2,
};

export const quotationStatusOptions = [
    { id: 1, name: "status.filter.sent.label" },
    { id: 2, name: "status.filter.pending.label" },
];

export const transferStatusOptions = [
    { id: 0, name: "unit.filter.all.label" },
    { id: 1, name: "status.filter.complated.label" },
    { id: 2, name: "status.filter.sent.label" },
    { id: 3, name: "status.filter.pending.label" },
];

export const transferCreatStatusOptions = [
    { id: 1, name: "status.filter.complated.label" },
    { id: 2, name: "status.filter.sent.label" },
    { id: 3, name: "status.filter.pending.label" },
];

export const smsStatusOptions = [
    { id: 1, name: "active.status.lable" },
    { id: 2, name: "in-active.status.lable" },
];

export const saleReturnStatusOptions = [
    { id: 1, name: "status.filter.received.label" },
    { id: 2, name: "status.filter.pending.label" },
];

export const languageFileOptions = [
    { id: 1, name: "Language.json" },
    { id: 2, name: "Messages.php" },
    { id: 3, name: "Error Messages" },
    { id: 4, name: "Success Messages" },
    { id: 5, name: "Pdf Messages" },
];

export const ROLES = {
    SUPER_ADMIN: "superadmin",
    ADMIN: "admin",
};

export const frequencies = [
    { id: 1, name: "weekly.title" },
    { id: 2, name: "monthly.title" },
    { id: 3, name: "yearly.title" },
    { id: 4, name: "unlimited.title" },
];

export const FREQUENCY_TYPE = {
    WEEKLY: 1,
    MONTHLY: 2,
    YEARLY: 3,
    UNLIMITED: 4,
};

export const PAYMENT_METHODS = {
    STRIPE: 1,
    PAYPAL: 2,
    MANUAL: 3,
    RAZORPAY: 4
};

export const paymentMethods = [
    { id: 0, name: "free.title" },
    { id: 1, name: "stripe.title" },
    { id: 2, name: "paypal.title" },
    { id: 3, name: "manually.title" },
    { id: 4, name: "razorpay.title" },
];

export const dateFormatOptions = [
    {
        label: "DD-MM-YYYY",
        value: "d-m-y",
    },
    {
        label: "MM-DD-YYYY",
        value: "m-d-y",
    },
    {
        label: "YYYY-MM-DD",
        value: "y-m-d",
    },
    {
        label: "MM/DD/YYYY",
        value: "m/d/y",
    },
    {
        label: "DD/MM/YYYY",
        value: "d/m/y",
    },
    {
        label: "YYYY/MM/DD",
        value: "y/m/d",
    },
    {
        label: "MM.DD.YYYY",
        value: "m.d.y",
    },
    {
        label: "DD.MM.YYYY",
        value: "d.m.y",
    },
    {
        label: "YYYY.MM.DD",
        value: "y.m.d",
    },
];

export const PLAN_STATUS = {
    INACTIVE: 0,
    ACTIVE: 1,
    PENDING: 2,
    REJECTED: 3,
};

export const PAYMENT_STATUS = {
    FAILED: 0,
    SUCCESSFUL: 1,
};

export const cashPaymentStatusMethodOptions = [
    // { id: 0, name: "status.filter.pending.label" },
    { id: 1, name: "globally.approve.label" },
    { id: 3, name: "globally.reject.label" },
];

export const planFeatures = [
    { name: "plans.pos.management.label", key: "pos_management", selected: false },
    { name: "reports.title", key: "reports", selected: false },
    { name: "plans.emails.support.label", key: "emails_support", selected: false },
    { name: "plans.sms.support.label", key: "sms_support", selected: false },
    { name: "plans.inventory.management.label", key: "inventory_management", selected: false },
    { name: "adjustments.title", key: "adjustments", selected: false },
    { name: "plans.roles.permission.support.label", key: "roles_permission", selected: false },
];

export const permissionMappings = {
    manage_dashboard: "/user/dashboard",
    manage_roles: "/user/roles",
    manage_brands: "/user/brands",
    manage_warehouses: "/user/warehouses",
    manage_units: "/user/units",
    manage_product_categories: "/user/product-categories",
    manage_products: "/user/products",
    manage_suppliers: "/user/suppliers",
    manage_customers: "/user/customers",
    manage_users: "/user/users",
    manage_purchase: "/user/purchases",
    manage_pos_screen: "/user/pos",
    manage_sale: "/user/sales",
    manage_print_barcode: "/user/print/barcode",
    manage_adjustments: "/user/adjustments",
    manage_quotations: "/user/quotations",
    manage_transfers: "/user/transfers",
    manage_expenses: "/user/expenses",
    manage_currency: "/user/currencies",
    manage_variations: "/user/variations",
    manage_expense_categories: "/user/expense-categories",
    manage_setting: "/user/settings",
    manage_purchase_return: "/user/purchase-return",
    manage_sale_return: "/user/sale-return",
    manage_report: "/user/report/report-warehouse",
    manage_language: "/user/languages",
    manage_asistences: "/user/asistences",
};

export const paymentOptions = {
    CASH: 1,
    CHEQUE: 1,
    BANK_TRANSFER: 3,
    OTHER: 4,
};
