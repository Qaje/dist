import apiConfig from "../../config/apiConfig";
import { apiBaseURL, asistancesActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import { setLoading } from "./loadingAction";
import {
    setTotalRecord,
    addInToTotalRecord,
    removeFromTotalRecord,
} from "./totalRecordAction";
import requestParam from "../../shared/requestParam";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";
import { callFetchDataApi } from "./updateBrand";

export const fetchAssistances = (filter = {}, isLoading = true) => async (dispatch) => {
    dispatch({
        type: asistancesActionType.FETCH_ASSISTANCES_REQUEST
    });


    if (isLoading) {
        dispatch(setLoading(true));
    }

    let url = apiBaseURL.ASSISTANCES;
    if (filter.page || filter.pageSize || filter.search ) {
        url += requestParam(filter);
    }

    try {
        const response = await apiConfig.get(url);

        // Procesar los datos correctamente según la estructura JSON
        const processedData = response.data.data.map(item => ({
            id: item.id,
            name: item.attributes.name,
            code: item.attributes.code,
            asistence_category_id: item.attributes.asistence_category_id,
            asistence_cost: item.attributes.asistence_cost,
            asistence_price: item.attributes.asistence_price,
            asistence_unit: item.attributes.asistence_unit,
            estimated_duration: item.attributes.estimated_duration,
            image_path: item.attributes.image_path,
            image_url: item.attributes.image_url,
            order_tax: item.attributes.order_tax,
            tax_type: item.attributes.tax_type,
            description: item.attributes.description,
            notes: item.attributes.notes,
            is_active: item.attributes.is_active,
            sale_unit: item.attributes.sale_unit,
            sale_unit_name: item.attributes.sale_unit_name,
            category: item.attributes.category?.name || 'N/A',
            created_at: item.attributes.created_at || null
        }));

        console.log('Datos procesados:', processedData);

        console.log('Despachando datos al reducer:', {
            data: processedData,
            meta: response.data.meta
        });

        dispatch({
            type: asistancesActionType.FETCH_ASSISTANCES_SUCCESS,
            payload: {
                data: processedData,
                meta: response.data.meta
            }
        });

        dispatch(setTotalRecord(response.data.meta?.total || 0));

        if (isLoading) {
            dispatch(setLoading(false));
        }

        console.log('es processedData luego de dispatch', processedData);
        return processedData;
    } catch (error) {
        console.error('Error en fetchAssistances:', error);
        dispatch({
            type: asistancesActionType.FETCH_ASSISTANCES_FAILURE,
            payload: error.response?.data?.message || 'Error al cargar asistencias'
        });

        dispatch(addToast({
            text: error.response?.data?.message || 'Error al cargar asistencias',
            type: toastType.ERROR
        }));

        if (isLoading) {
            dispatch(setLoading(false));
        }
    }
};

export const fetchAssistance =
    (assistanceId, singleAssistance, isLoading = true) =>
        async (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }
            apiConfig
                .get(apiBaseURL.ASSISTANCES + "/" + assistanceId, singleAssistance)
                .then((response) => {
                    dispatch({
                        type: asistancesActionType.FETCH_ASSISTANCE,
                        payload: response.data.data,
                    });
                    if (isLoading) {
                        dispatch(setLoading(false));
                    }
                })
                .catch(({ response }) => {
                    dispatch(
                        addToast({
                            text: response?.data?.message,
                            type: toastType.ERROR,
                        })
                    );
                    if (isLoading) {
                        dispatch(setLoading(false));
                    }
                });
        };

export const addAssistance = (assistanceData) => async (dispatch) => {
    try {
        dispatch({ type: asistancesActionType.ADD_ASSISTANCE_REQUEST });
        // Envío directo con la estructura que espera el backend
        const response = await apiConfig.post(apiBaseURL.ASSISTANCES, assistanceData);
        // Procesar la respuesta según la estructura de tu JSON de ejemplo
        let processedResponse;

        if (response.data.data && response.data.data.attributes) {
            // Si viene con estructura JSON:API (respuesta GET)
            processedResponse = {
                id: response.data.data.id,
                name: response.data.data.attributes.name,
                code: response.data.data.attributes.code,
                asistence_category_id: response.data.data.attributes.asistence_category_id,
                asistence_cost: response.data.data.attributes.asistence_cost,
                asistence_price: response.data.data.attributes.asistence_price,
                asistence_unit: response.data.data.attributes.asistence_unit,
                estimated_duration: response.data.data.attributes.estimated_duration,
                order_tax: response.data.data.attributes.order_tax,
                tax_type: response.data.data.attributes.tax_type,
                description: response.data.data.attributes.description,
                notes: response.data.data.attributes.notes,
                is_active: response.data.data.attributes.is_active,
                category: response.data.data.attributes.category?.name || 'N/A',
                created_at: response.data.data.attributes.created_at || null
            };
        } else {
            // Si viene con estructura directa (como el ejemplo que enviaste)
            processedResponse = {
                id: response.data.id,
                name: response.data.name,
                code: response.data.code,
                asistence_category_id: response.data.asistence_category_id,
                asistence_cost: response.data.asistence_cost,
                asistence_price: response.data.asistence_price,
                asistence_unit: response.data.asistence_unit,
                estimated_duration: response.data.estimated_duration,
                order_tax: response.data.order_tax,
                tax_type: response.data.tax_type,
                description: response.data.description,
                notes: response.data.notes,
                is_active: response.data.is_active,
                category: response.data.category?.name || 'N/A',
                created_at: response.data.created_at || null
            };
        }

        dispatch({
            type: asistancesActionType.ADD_ASSISTANCE_SUCCESS,
            payload: processedResponse
        });

        dispatch(
            addToast({
                text: getFormattedMessage("asistance.success.create.message") || "Asistencia creada exitosamente",
            })
        );

        return processedResponse;
    } catch (error) {

        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            'Error creating assistance';

        dispatch({
            type: asistancesActionType.ADD_ASSISTANCE_FAILURE,
            payload: errorMessage
        });

        dispatch(
            addToast({
                text: errorMessage,
                type: toastType.ERROR,
            })
        );

        throw error;
    }
};

export const editAssistance =
    (assistanceId, assistance, navigate) => async (dispatch) => {
        dispatch(setSavingButton(true));
        apiConfig
            .put(apiBaseURL.ASSISTANCES + "/" + assistanceId, assistance)
            .then((response) => {
                dispatch({
                    type: asistancesActionType.EDIT_ASSISTANCE,
                    payload: response.data.data,
                });
                dispatch(
                    addToast({
                        text: getFormattedMessage("asistance.success.edit.message"),
                    })
                );
                dispatch(setSavingButton(false));
                if (navigate) {
                    navigate("/assistances");
                }
            })
            .catch(({ response }) => {
                dispatch(setSavingButton(false));
                dispatch(
                    addToast({
                        text: response?.data?.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

export const deleteAssistance = (assistanceId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.ASSISTANCES + "/" + assistanceId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch({
                type: asistancesActionType.DELETE_ASSISTANCE,
                payload: assistanceId,
            });
            dispatch(callFetchDataApi(true));
            dispatch(
                addToast({
                    text: getFormattedMessage("asistance.success.delete.message"),
                })
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response?.data?.message, type: toastType.ERROR })
            );
        });
};

// Agrega esta acción al final de tu archivo asistancesAction.js

export const fetchAssistanceDetail = (id) => async (dispatch) => {
    dispatch({ type: 'FETCH_ASSISTANCE_DETAIL_REQUEST' });

    try {
        console.log('🔍 Obteniendo detalle de asistencia con ID:', id);

        const response = await apiConfig.get(`${apiBaseURL.ASSISTANCES}/${id}`);
        console.log('✅ Respuesta del detalle:', response.data);

        let processedData;

        // Verificar si la respuesta tiene la estructura JSON:API
        if (response.data.data && response.data.data.attributes) {
            processedData = {
                id: response.data.data.id,
                name: response.data.data.attributes.name,
                code: response.data.data.attributes.code,
                asistence_category_id: response.data.data.attributes.asistence_category_id,
                asistence_cost: response.data.data.attributes.asistence_cost,
                asistence_price: response.data.data.attributes.asistence_price,
                asistence_unit: response.data.data.attributes.asistence_unit,
                estimated_duration: response.data.data.attributes.estimated_duration,
                order_tax: response.data.data.attributes.order_tax,
                tax_type: response.data.data.attributes.tax_type,
                description: response.data.data.attributes.description,
                notes: response.data.data.attributes.notes,
                is_active: response.data.data.attributes.is_active,
                category: response.data.data.attributes.category?.name || 'N/A',
                created_at: response.data.data.attributes.created_at || null
            };
        } else {
            // Si viene con estructura directa
            processedData = {
                id: response.data.id,
                name: response.data.name,
                code: response.data.code,
                asistence_category_id: response.data.asistence_category_id,
                asistence_cost: response.data.asistence_cost,
                asistence_price: response.data.asistence_price,
                asistence_unit: response.data.asistence_unit,
                estimated_duration: response.data.estimated_duration,
                order_tax: response.data.order_tax,
                tax_type: response.data.tax_type,
                description: response.data.description,
                notes: response.data.notes,
                is_active: response.data.is_active,
                category: response.data.category?.name || 'N/A',
                created_at: response.data.created_at || null
            };
        }

        console.log('🎯 Datos procesados del detalle:', processedData);

        dispatch({
            type: 'FETCH_ASSISTANCE_DETAIL_SUCCESS',
            payload: processedData
        });

    } catch (error) {
        console.error('❌ Error al obtener detalle:', error);

        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            'Error al obtener el detalle de la asistencia';

        dispatch({
            type: 'FETCH_ASSISTANCE_DETAIL_FAILURE',
            payload: errorMessage
        });

        dispatch(addToast({
            text: errorMessage,
            type: toastType.ERROR
        }));
    }
};
