import apiConfig from "../../config/apiConfig";
import { apiBaseURL, toastType, consolidatedPaymentActionType } from "../../constants";
import { addToast } from "./toastAction";
import { setLoading } from "./loadingAction";
import requestParam from "../../shared/requestParam";

// ===== EXPORTAR CONSTANTES DE ACCIÓN =====
export const {
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

// ===== ACCIONES PRINCIPALES =====

// Obtener ventas consolidadas por cliente
export const fetchConsolidatedSales = (filter = {}, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true));
    }

    dispatch({ type: FETCH_CONSOLIDATED_SALES });

    let url = apiBaseURL.CONSOLIDATED_SALES;

    if (!_.isEmpty(filter) && (filter.warehouse_id || filter.customer_id)) {
        url += requestParam(filter, false, null, null, url);
    }

    await apiConfig
        .get(url)
        .then((response) => {
            dispatch({
                type: FETCH_CONSOLIDATED_SALES_SUCCESS,
                payload: response.data.data || response.data,
            });
            if (isLoading) {
                dispatch(setLoading(false));
            }
        })
        .catch(({ response }) => {
            dispatch({
                type: FETCH_CONSOLIDATED_SALES_FAILED,
                payload: response?.data?.message || 'Error al obtener ventas consolidadas'
            });
            dispatch(
                addToast({
                    text: response?.data?.message || 'Error al obtener ventas consolidadas',
                    type: toastType.ERROR,
                })
            );
            if (isLoading) {
                dispatch(setLoading(false));
            }
        });
};

// Crear pago consolidado
export const createConsolidatedPayment = (paymentData, navigate) => async (dispatch) => {
    dispatch({ type: CREATE_CONSOLIDATED_PAYMENT });

    const url = apiBaseURL.CONSOLIDATED_PAYMENTS;

    await apiConfig
        .post(url, paymentData)
        .then((response) => {
            dispatch({
                type: CREATE_CONSOLIDATED_PAYMENT_SUCCESS,
                payload: response.data.data || response.data,
            });

            dispatch(
                addToast({
                    text: 'Pago consolidado procesado exitosamente',
                    type: toastType.SUCCESS
                })
            );

            // Navegar de vuelta si se proporciona navigate
            if (navigate) {
                navigate("/admin/reports/warehouse");
            }
        })
        .catch(({ response }) => {
            dispatch({
                type: CREATE_CONSOLIDATED_PAYMENT_FAILED,
                payload: response?.data?.message || 'Error al procesar pago consolidado'
            });

            dispatch(
                addToast({
                    text: response?.data?.message || 'Error al procesar pago consolidado',
                    type: toastType.ERROR,
                })
            );
        });
};

// Obtener historial de pagos consolidados
export const fetchConsolidatedHistory = (filter = {}, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true));
    }

    dispatch({ type: FETCH_CONSOLIDATED_HISTORY });

    let url = apiBaseURL.CONSOLIDATED_HISTORY;

    if (!_.isEmpty(filter) && (filter.customer_id || filter.warehouse_id || filter.date_from || filter.date_to)) {
        url += requestParam(filter, false, null, null, url);
    }

    await apiConfig
        .get(url)
        .then((response) => {
            dispatch({
                type: FETCH_CONSOLIDATED_HISTORY_SUCCESS,
                payload: response.data.data || response.data,
            });
            if (isLoading) {
                dispatch(setLoading(false));
            }
        })
        .catch(({ response }) => {
            dispatch({
                type: FETCH_CONSOLIDATED_HISTORY_FAILED,
                payload: response?.data?.message || 'Error al obtener historial'
            });
            dispatch(
                addToast({
                    text: response?.data?.message || 'Error al obtener historial',
                    type: toastType.ERROR,
                })
            );
            if (isLoading) {
                dispatch(setLoading(false));
            }
        });
};

// Validar ventas para consolidación
export const validateSalesForConsolidation = (validationData) => async (dispatch) => {
    const url = apiBaseURL.CONSOLIDATED_PAYMENTS + "/validate";

    return await apiConfig
        .post(url, validationData)
        .then((response) => {
            return response;
        })
        .catch(({ response }) => {
            dispatch(
                addToast({
                    text: response?.data?.message || 'Error en validación',
                    type: toastType.ERROR,
                })
            );
            throw response;
        });
};

// Obtener detalles de pago consolidado
export const fetchConsolidatedPaymentDetails = (paymentId) => async (dispatch) => {
    const url = apiBaseURL.CONSOLIDATED_PAYMENTS + "/" + paymentId;

    return await apiConfig
        .get(url)
        .then((response) => {
            return response;
        })
        .catch(({ response }) => {
            dispatch(
                addToast({
                    text: response?.data?.message || 'Error al obtener detalles',
                    type: toastType.ERROR,
                })
            );
            throw response;
        });
};

// Cancelar pago consolidado
export const cancelConsolidatedPayment = (paymentId) => async (dispatch) => {
    const url = apiBaseURL.CONSOLIDATED_PAYMENTS + "/" + paymentId;

    return await apiConfig
        .delete(url)
        .then((response) => {
            dispatch(
                addToast({
                    text: 'Pago consolidado cancelado exitosamente',
                    type: toastType.SUCCESS
                })
            );
            return response;
        })
        .catch(({ response }) => {
            dispatch(
                addToast({
                    text: response?.data?.message || 'Error al cancelar pago consolidado',
                    type: toastType.ERROR,
                })
            );
            throw response;
        });
};

// ===== ACCIONES ADICIONALES =====

// Limpiar estado completo
export const clearConsolidatedPaymentState = () => ({
    type: 'CLEAR_CONSOLIDATED_PAYMENT_STATE'
});

// Limpiar errores
export const clearConsolidatedPaymentError = () => ({
    type: 'CLEAR_CONSOLIDATED_PAYMENT_ERROR'
});

// Resetear ventas consolidadas
export const resetConsolidatedSales = () => ({
    type: RESET_CONSOLIDATED_SALES
});

// Establecer filtros
export const setConsolidatedFilters = (filters) => ({
    type: 'SET_CONSOLIDATED_FILTERS',
    payload: filters
});

// Limpiar filtros
export const clearConsolidatedFilters = () => ({
    type: 'CLEAR_CONSOLIDATED_FILTERS'
});

// Establecer pago consolidado actual
export const setCurrentConsolidatedPayment = (payment) => ({
    type: 'SET_CURRENT_CONSOLIDATED_PAYMENT',
    payload: payment
});

// Limpiar pago consolidado actual
export const clearCurrentConsolidatedPayment = () => ({
    type: 'CLEAR_CURRENT_CONSOLIDATED_PAYMENT'
});

// Establecer resultados de validación
export const setValidationResults = (results) => ({
    type: 'SET_VALIDATION_RESULTS',
    payload: results
});

// Limpiar resultados de validación
export const clearValidationResults = () => ({
    type: 'CLEAR_VALIDATION_RESULTS'
});

// Obtener estadísticas para dashboard
export const fetchDashboardStats = (filter = {}) => async (dispatch) => {
    let url = apiBaseURL.CONSOLIDATED_STATS;

    if (!_.isEmpty(filter)) {
        url += requestParam(filter, false, null, null, url);
    }

    await apiConfig
        .get(url)
        .then((response) => {
            dispatch({
                type: 'SET_DASHBOARD_STATS',
                payload: response.data.data || response.data
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({
                    text: response?.data?.message || 'Error al obtener estadísticas',
                    type: toastType.ERROR,
                })
            );
        });
};

// Obtener resumen consolidado
export const fetchConsolidatedSummary = (filter = {}) => async (dispatch) => {
    let url = apiBaseURL.CONSOLIDATED_SUMMARY;

    if (!_.isEmpty(filter)) {
        url += requestParam(filter, false, null, null, url);
    }

    await apiConfig
        .get(url)
        .then((response) => {
            dispatch({
                type: 'SET_CONSOLIDATED_SUMMARY',
                payload: response.data.data || response.data
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({
                    text: response?.data?.message || 'Error al obtener resumen',
                    type: toastType.ERROR,
                })
            );
        });
};

// Actualizar venta después de pago consolidado
export const updateConsolidatedSale = (updateData) => ({
    type: 'UPDATE_CONSOLIDATED_SALE',
    payload: updateData
});

// Remover cliente de consolidados
export const removeCustomerFromConsolidated = (customerId) => ({
    type: 'REMOVE_CUSTOMER_FROM_CONSOLIDATED',
    payload: { customer_id: customerId }
});

// Refrescar datos después de crear pago consolidado
export const refreshConsolidatedData = (filters = {}) => async (dispatch) => {
    // Refrescar ventas consolidadas
    await dispatch(fetchConsolidatedSales(filters, false));

    // Refrescar historial si es necesario
    if (filters.include_history) {
        await dispatch(fetchConsolidatedHistory(filters, false));
    }

    // Refrescar estadísticas si es necesario
    if (filters.include_stats) {
        await dispatch(fetchDashboardStats(filters));
    }

    // Refrescar resumen si es necesario
    if (filters.include_summary) {
        await dispatch(fetchConsolidatedSummary(filters));
    }
};

// Acción para usar la URL alternativa de pago consolidado
export const createSaleConsolidatedPayment = (paymentData, navigate) => async (dispatch) => {
    dispatch({ type: CREATE_CONSOLIDATED_PAYMENT });

    const url = apiBaseURL.SALE_CONSOLIDATED_PAYMENTS;

    await apiConfig
        .post(url, paymentData)
        .then((response) => {
            dispatch({
                type: CREATE_CONSOLIDATED_PAYMENT_SUCCESS,
                payload: response.data.data || response.data,
            });

            dispatch(
                addToast({
                    text: 'Pago consolidado procesado exitosamente',
                    type: toastType.SUCCESS
                })
            );

            if (navigate) {
                navigate("/admin/reports/warehouse");
            }
        })
        .catch(({ response }) => {
            dispatch({
                type: CREATE_CONSOLIDATED_PAYMENT_FAILED,
                payload: response?.data?.message || 'Error al procesar pago consolidado'
            });

            dispatch(
                addToast({
                    text: response?.data?.message || 'Error al procesar pago consolidado',
                    type: toastType.ERROR,
                })
            );
        });
};

export const calculatePaymentAllocation = (consolidatedSales, paymentAmount) => {
    // Validar inputs
    if (!consolidatedSales || !Array.isArray(consolidatedSales) || !paymentAmount) {
        return {
            allocations: [],
            totalAllocated: 0,
            remainingPayment: paymentAmount || 0
        };
    }

    // Convertir paymentAmount a número y validar
    const totalPayment = parseFloat(paymentAmount);
    if (isNaN(totalPayment) || totalPayment <= 0) {
        return {
            allocations: [],
            totalAllocated: 0,
            remainingPayment: 0
        };
    }

    // Ordenar ventas por fecha (más antigua primero)
    const sortedSales = [...consolidatedSales].sort((a, b) =>
        new Date(a.created_at) - new Date(b.created_at)
    );

    const allocations = [];
    let remainingPayment = totalPayment;

    for (const sale of sortedSales) {
        if (remainingPayment <= 0) break;

        // Calcular el monto pendiente de esta venta
        const grandTotal = parseFloat(sale.grand_total) || 0;
        const paidAmount = parseFloat(sale.paid_amount) || 0;
        const dueAmount = grandTotal - paidAmount;

        if (dueAmount > 0) {
            // Calcular cuánto se puede pagar de esta venta
            const allocationAmount = Math.min(dueAmount, remainingPayment);

            allocations.push({
                sale_id: sale.id,
                reference_code: sale.reference_code,
                due_amount: dueAmount,
                allocated_amount: allocationAmount,
                remaining_due: dueAmount - allocationAmount,
                grand_total: grandTotal,
                paid_amount: paidAmount
            });

            remainingPayment -= allocationAmount;
        }
    }

    const totalAllocated = totalPayment - remainingPayment;

    return {
        allocations,
        totalAllocated,
        remainingPayment
    };
};
