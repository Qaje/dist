import apiConfig from "../../../config/apiConfig";
import { apiBaseURL, asistancesActionType, posAssistanceActionType } from "../../../constants";

// Función helper para setLoading
const setLoading = (loading) => ({
    type: 'SET_LOADING',
    payload: loading
});

export const fetchAssistanceClickable = (
    assistanceCategoryId = null,
    warehouseId = null,
    page = 1,
    search = "",
    resetPage = false
) => async (dispatch, getState) => {

    if (resetPage || page === 1) {
        dispatch(setLoading(true));
    }

    if (resetPage) {
        dispatch({ type: asistancesActionType.RESET_ASSISTANCE });
    }

    const currentAssistances = getState().posAllAssistances || [];

    try {
        let url = `${apiBaseURL.ASSISTANCES}?`;
        const params = new URLSearchParams();

        // Filtros basados en tu estructura JSON
        if (assistanceCategoryId) {
            params.append('filter[asistence_category_id]', assistanceCategoryId);
        }

        if (warehouseId) {
            params.append('filter[warehouse_id]', warehouseId);
        }

        if (search && search.trim()) {
            params.append('filter[search]', search.trim());
        }

        // Solo servicios activos
        params.append('filter[is_active]', 'true');

        // Paginación
        params.append('page[size]', '30');
        params.append('page[number]', page);

        url += params.toString();

        console.log('🔍 Fetching assistances:', {
            url,
            page,
            resetPage,
            currentCount: currentAssistances.length
        });

        const response = await apiConfig.get(url);

        if (response.data?.data) {
            let assistances = response.data.data;

            // Validar y estructurar datos según tu JSON
            assistances = assistances.map(assistance => {
                const attrs = assistance.attributes || {};

                return {
                    ...assistance,
                    // Asegurar estructura consistente
                    attributes: {
                        // Campos principales
                        name: attrs.name || 'Servicio sin nombre',
                        code: attrs.code || '',

                        // Precios (usar tus campos específicos)
                        asistence_price: Number(attrs.asistence_price || 0),
                        asistence_cost: Number(attrs.asistence_cost || 0),
                        asistence_unit: attrs.asistence_unit || '1',

                        // Duración y descripción
                        estimated_duration: Number(attrs.estimated_duration || 0),
                        description: attrs.description || '',
                        notes: attrs.notes || '',

                        // Impuestos
                        order_tax: Number(attrs.order_tax || 0),
                        tax_type: attrs.tax_type || '1',

                        // Categoría y estado
                        asistence_category_id: attrs.asistence_category_id,
                        is_active: Boolean(attrs.is_active),

                        // Fechas
                        created_at: attrs.created_at,
                        updated_at: attrs.updated_at,

                        // Imagen por defecto para servicios
                        image_url: attrs.image_url || '/images/default-service-icon.png',

                        // Mantener otros campos
                        ...attrs
                    }
                };
            });

            // Combinar con existentes si no es reset
            if (!resetPage && page > 1) {
                const existingIds = currentAssistances.map(a => a.id);
                const newAssistances = assistances.filter(a => !existingIds.includes(a.id));
                assistances = [...currentAssistances, ...newAssistances];
            }

            dispatch({
                type: asistancesActionType.FETCH_ASSISTANCE_CLICKABLE,
                payload: assistances,
            });

            console.log('✅ Assistances loaded:', {
                newCount: assistances.length,
                page,
                sampleData: assistances[0]?.attributes
            });
        }

    } catch (error) {
        console.error('❌ Error fetching assistances:', error);

        if (error.response?.status === 404) {
            console.warn('⚠️ Assistance API endpoint not found. Check if /api/asistences exists.');
        }

        // Dispatch error action
        dispatch({
            type: asistancesActionType.FETCH_ASSISTANCE_ERROR,
            payload: error.message
        });
    } finally {
        dispatch(setLoading(false));
    }
};

export const posAllAssistance = (filter = {}) => async (dispatch) => {
    dispatch(setLoading(true));

    try {
        let url = `${apiBaseURL.ASSISTANCES}?page[size]=0`;

        if (filter && Object.keys(filter).length > 0) {
            const params = new URLSearchParams();
            Object.keys(filter).forEach(key => {
                if (filter[key] !== null && filter[key] !== undefined && filter[key] !== '') {
                    // Mapear campos si es necesario
                    let filterKey = key;
                    if (key === 'category_id') {
                        filterKey = 'asistence_category_id';
                    }
                    params.append(`filter[${filterKey}]`, filter[key]);
                }
            });
            url += '&' + params.toString();
        }

        // Solo servicios activos
        if (!url.includes('is_active')) {
            url += url.includes('?') ? '&' : '?';
            url += 'filter[is_active]=true';
        }

        console.log('🔍 Fetching ALL assistances:', url);

        const response = await apiConfig.get(url);

        if (response.data?.data) {
            // Procesar datos según tu estructura
            const assistances = response.data.data.map(assistance => {
                const attrs = assistance.attributes || {};

                return {
                    ...assistance,
                    attributes: {
                        name: attrs.name || 'Servicio sin nombre',
                        code: attrs.code || '',
                        asistence_price: Number(attrs.asistence_price || 0),
                        asistence_cost: Number(attrs.asistence_cost || 0),
                        asistence_unit: attrs.asistence_unit || '1',
                        estimated_duration: Number(attrs.estimated_duration || 0),
                        description: attrs.description || '',
                        notes: attrs.notes || '',
                        order_tax: Number(attrs.order_tax || 0),
                        tax_type: attrs.tax_type || '1',
                        asistence_category_id: attrs.asistence_category_id,
                        is_active: Boolean(attrs.is_active),
                        image_url: attrs.image_url || '/images/default-service-icon.png',
                        ...attrs
                    }
                };
            });

            dispatch({
                type: posAssistanceActionType.POS_ALL_ASSISTANCE,
                payload: assistances,
            });

            console.log('✅ All assistances loaded:', {
                count: assistances.length,
                sampleData: assistances[0]?.attributes
            });
        }
    } catch (error) {
        console.error('❌ Error fetching all assistances:', error);

        dispatch({
            type: posAssistanceActionType.POS_ALL_ASSISTANCE_ERROR,
            payload: error.message
        });
    } finally {
        dispatch(setLoading(false));
    }
};

// Función para buscar por código específico (útil para el searchbar)
export const searchAssistanceByCode = (code, warehouseId = null) => async (dispatch) => {
    if (!code || code.trim().length < 1) {
        return null;
    }

    try {
        const params = new URLSearchParams();
        params.append('filter[code]', code.trim().toUpperCase());
        params.append('filter[is_active]', 'true');

        if (warehouseId) {
            params.append('filter[warehouse_id]', warehouseId);
        }

        const url = `${apiBaseURL.ASSISTANCES}?${params.toString()}`;
        const response = await apiConfig.get(url);

        if (response.data?.data && response.data.data.length > 0) {
            return response.data.data[0]; // Retornar la primera coincidencia
        }

        return null;
    } catch (error) {
        console.error('❌ Error searching assistance by code:', error);
        return null;
    }
};
