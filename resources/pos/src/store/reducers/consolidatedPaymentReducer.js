// src/store/reducers/consolidatedPaymentReducer.js

import { consolidatedPaymentActionType } from '../../constants';

// Extraer constantes del objeto importado
const {
    FETCH_CONSOLIDATED_SALES,
    FETCH_CONSOLIDATED_SALES_SUCCESS,
    FETCH_CONSOLIDATED_SALES_FAILED,
    CREATE_CONSOLIDATED_PAYMENT,
    CREATE_CONSOLIDATED_PAYMENT_SUCCESS,
    CREATE_CONSOLIDATED_PAYMENT_FAILED,
    FETCH_CONSOLIDATED_HISTORY,
    FETCH_CONSOLIDATED_HISTORY_SUCCESS,
    FETCH_CONSOLIDATED_HISTORY_FAILED,
    RESET_CONSOLIDATED_SALES
} = consolidatedPaymentActionType;

const initialState = {
    // Ventas consolidadas por cliente
    consolidatedSales: [],
    consolidatedSalesMeta: {},

    // Historial de pagos consolidados
    consolidatedHistory: [],
    consolidatedHistoryMeta: {},

    // Pago consolidado actual (para formularios)
    currentConsolidatedPayment: null,

    // Estados de carga (siguiendo tu patrón de assistanceReducer)
    loading: false,

    // Estados de errores
    error: null,

    // Filtros aplicados
    appliedFilters: {
        warehouse_id: null,
        customer_id: null,
        date_from: null,
        date_to: null
    },

    // Estado del último pago creado
    lastCreatedPayment: null,

    // Validaciones
    validationResults: null,

    // Estadísticas y resumen
    dashboardStats: null,
    consolidatedSummary: null
};

export default (state = initialState, action) => {
    console.log('🔄 ConsolidatedPayment Reducer recibió action:', action.type);
    console.log('📦 Payload del action:', action.payload);
    console.log('📊 Estado actual antes:', state);

    switch (action.type) {

        // ==== FETCH CONSOLIDATED SALES ====
        case FETCH_CONSOLIDATED_SALES:
            console.log('⏳ REQUEST: Obteniendo ventas consolidadas...');
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_CONSOLIDATED_SALES_SUCCESS:
            console.log('✅ SUCCESS: Ventas consolidadas obtenidas');
            console.log('🔍 Datos consolidados a guardar:', action.payload);

            const newSalesState = {
                ...state,
                loading: false,
                consolidatedSales: action.payload || [],
                consolidatedSalesMeta: {
                    total: action.payload?.length || 0,
                    totalPendingAmount: action.payload?.reduce((sum, customer) => sum + (customer.total_pending || 0), 0) || 0,
                    totalCustomers: action.payload?.length || 0
                },
                error: null
            };

            console.log('🏁 Nuevo estado ventas después:', newSalesState);
            return newSalesState;

        case FETCH_CONSOLIDATED_SALES_FAILED:
            console.log('❌ FETCH SALES FAILURE:', action.payload);
            return {
                ...state,
                loading: false,
                consolidatedSales: [],
                consolidatedSalesMeta: {},
                error: action.payload
            };

        // ==== CREATE CONSOLIDATED PAYMENT ====
        case CREATE_CONSOLIDATED_PAYMENT:
            console.log('⏳ CREATE REQUEST: Creando pago consolidado...');
            return {
                ...state,
                loading: true,
                error: null
            };

        case CREATE_CONSOLIDATED_PAYMENT_SUCCESS:
            console.log('✅ CREATE SUCCESS: Pago consolidado creado');
            console.log('🔍 Pago creado:', action.payload);

            const newPaymentState = {
                ...state,
                loading: false,
                lastCreatedPayment: action.payload,
                currentConsolidatedPayment: null,
                error: null,
                // Agregar al historial si existe
                consolidatedHistory: state.consolidatedHistory.length > 0
                    ? [action.payload, ...state.consolidatedHistory]
                    : state.consolidatedHistory,
                consolidatedHistoryMeta: state.consolidatedHistory.length > 0
                    ? {
                        ...state.consolidatedHistoryMeta,
                        total: (state.consolidatedHistoryMeta.total || 0) + 1,
                        totalAmount: (state.consolidatedHistoryMeta.totalAmount || 0) + (action.payload.total_amount || 0)
                    }
                    : state.consolidatedHistoryMeta
            };

            console.log('🏁 Nuevo estado pago después:', newPaymentState);
            return newPaymentState;

        case CREATE_CONSOLIDATED_PAYMENT_FAILED:
            console.log('❌ CREATE PAYMENT FAILURE:', action.payload);
            return {
                ...state,
                loading: false,
                error: action.payload,
                lastCreatedPayment: null
            };

        // ==== FETCH CONSOLIDATED HISTORY ====
        case FETCH_CONSOLIDATED_HISTORY:
            console.log('⏳ REQUEST: Obteniendo historial consolidado...');
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_CONSOLIDATED_HISTORY_SUCCESS:
            console.log('✅ SUCCESS: Historial consolidado obtenido');
            console.log('🔍 Historial a guardar:', action.payload);

            const newHistoryState = {
                ...state,
                loading: false,
                consolidatedHistory: action.payload || [],
                consolidatedHistoryMeta: {
                    total: action.payload?.length || 0,
                    totalAmount: action.payload?.reduce((sum, payment) => sum + (payment.total_amount || 0), 0) || 0,
                    averageAmount: action.payload?.length > 0
                        ? (action.payload.reduce((sum, payment) => sum + (payment.total_amount || 0), 0) / action.payload.length)
                        : 0
                },
                error: null
            };

            console.log('🏁 Nuevo estado historial después:', newHistoryState);
            return newHistoryState;

        case FETCH_CONSOLIDATED_HISTORY_FAILED:
            console.log('❌ FETCH HISTORY FAILURE:', action.payload);
            return {
                ...state,
                loading: false,
                consolidatedHistory: [],
                consolidatedHistoryMeta: {},
                error: action.payload
            };

        // ==== RESET CONSOLIDATED SALES ====
        case RESET_CONSOLIDATED_SALES:
            console.log('🔄 RESET: Reseteando ventas consolidadas');
            return {
                ...state,
                consolidatedSales: [],
                consolidatedSalesMeta: {},
                error: null
            };

        // ==== ACCIONES ADICIONALES ====

        // Limpiar estado
        case 'CLEAR_CONSOLIDATED_PAYMENT_STATE':
            console.log('🧹 CLEAR: Limpiando estado consolidado');
            return {
                ...initialState
            };

        // Limpiar errores
        case 'CLEAR_CONSOLIDATED_PAYMENT_ERROR':
            console.log('🧹 CLEAR ERROR: Limpiando errores');
            return {
                ...state,
                error: null
            };

        // Establecer filtros aplicados
        case 'SET_CONSOLIDATED_FILTERS':
            console.log('🔧 SET FILTERS: Estableciendo filtros', action.payload);
            return {
                ...state,
                appliedFilters: {
                    ...state.appliedFilters,
                    ...action.payload
                }
            };

        // Limpiar filtros
        case 'CLEAR_CONSOLIDATED_FILTERS':
            console.log('🧹 CLEAR FILTERS: Limpiando filtros');
            return {
                ...state,
                appliedFilters: initialState.appliedFilters
            };

        // Establecer pago consolidado actual (para edición)
        case 'SET_CURRENT_CONSOLIDATED_PAYMENT':
            console.log('📝 SET CURRENT: Estableciendo pago actual', action.payload);
            return {
                ...state,
                currentConsolidatedPayment: action.payload
            };

        // Limpiar pago consolidado actual
        case 'CLEAR_CURRENT_CONSOLIDATED_PAYMENT':
            console.log('🧹 CLEAR CURRENT: Limpiando pago actual');
            return {
                ...state,
                currentConsolidatedPayment: null
            };

        // Establecer resultados de validación
        case 'SET_VALIDATION_RESULTS':
            console.log('✔️ SET VALIDATION: Estableciendo resultados', action.payload);
            return {
                ...state,
                validationResults: action.payload
            };

        // Limpiar resultados de validación
        case 'CLEAR_VALIDATION_RESULTS':
            console.log('🧹 CLEAR VALIDATION: Limpiando validaciones');
            return {
                ...state,
                validationResults: null
            };

        // Establecer estadísticas del dashboard
        case 'SET_DASHBOARD_STATS':
            console.log('📊 SET STATS: Estableciendo estadísticas', action.payload);
            return {
                ...state,
                dashboardStats: action.payload
            };

        // Establecer resumen consolidado
        case 'SET_CONSOLIDATED_SUMMARY':
            console.log('📋 SET SUMMARY: Estableciendo resumen', action.payload);
            return {
                ...state,
                consolidatedSummary: action.payload
            };

        // Actualizar una venta específica en consolidatedSales (después de pago)
        case 'UPDATE_CONSOLIDATED_SALE':
            console.log('🔄 UPDATE SALE: Actualizando venta consolidada', action.payload);

            const updatedSalesState = {
                ...state,
                consolidatedSales: state.consolidatedSales.map(customerSales => {
                    if (customerSales.customer_id === action.payload.customer_id) {
                        const updatedCustomerSales = {
                            ...customerSales,
                            sales_details: customerSales.sales_details.map(sale => {
                                if (action.payload.updated_sales.some(updatedSale => updatedSale.sale_id === sale.id)) {
                                    const updatedSale = action.payload.updated_sales.find(us => us.sale_id === sale.id);
                                    return {
                                        ...sale,
                                        paid_amount: sale.grand_total - updatedSale.new_pending_amount,
                                        pending_amount: updatedSale.new_pending_amount,
                                        payment_status: updatedSale.new_status
                                    };
                                }
                                return sale;
                            })
                        };
                        // Recalcular totales del cliente
                        updatedCustomerSales.total_pending = updatedCustomerSales.sales_details.reduce(
                            (sum, sale) => sum + (sale.pending_amount || 0), 0
                        );
                        updatedCustomerSales.total_paid = updatedCustomerSales.sales_details.reduce(
                            (sum, sale) => sum + (sale.paid_amount || 0), 0
                        );
                        return updatedCustomerSales;
                    }
                    return customerSales;
                })
            };

            console.log('🏁 Estado actualizado después de UPDATE_SALE:', updatedSalesState);
            return updatedSalesState;

        // Remover cliente de consolidatedSales (si no tiene más ventas pendientes)
        case 'REMOVE_CUSTOMER_FROM_CONSOLIDATED':
            console.log('🗑️ REMOVE CUSTOMER: Removiendo cliente', action.payload.customer_id);

            const filteredSalesState = {
                ...state,
                consolidatedSales: state.consolidatedSales.filter(
                    customerSales => customerSales.customer_id !== action.payload.customer_id
                ),
                consolidatedSalesMeta: {
                    ...state.consolidatedSalesMeta,
                    total: Math.max(0, (state.consolidatedSalesMeta.total || 1) - 1),
                    totalCustomers: Math.max(0, (state.consolidatedSalesMeta.totalCustomers || 1) - 1)
                }
            };

            console.log('🏁 Estado después de REMOVE_CUSTOMER:', filteredSalesState);
            return filteredSalesState;

        default:
            console.log('❓ Action no manejado:', action.type);
            return state;
    }
};
