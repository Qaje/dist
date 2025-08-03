import apiConfig from "../../config/apiConfig";
import {
    apiBaseURL,
    unitsActionType,
    toastType,
    Filters,
} from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import {
    setTotalRecord,
    addInToTotalRecord,
    removeFromTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { callFetchDataApi } from "./updateBrand";


export const fetchAllunits = () => async (dispatch) => {
    apiConfig
        .get(`units?page[size]=0`)
        .then((response) => {
            dispatch({
                type: warehouseActionType.FETCH_UNITS,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response?.data?.message, type: toastType.ERROR })
            );
        });
};

export const fetchUnit = (unitId, singleUnit) => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.UNITS + "/" + unitId, singleUnit)
        .then((response) => {
            dispatch({
                type: unitsActionType.FETCH_UNIT,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response?.data?.message, type: toastType.ERROR })
            );
        });
};

export const addUnit = (units) => async (dispatch) => {
    await apiConfig
        .post(apiBaseURL.UNITS, units)
        .then((response) => {
            dispatch({
                type: unitsActionType.ADD_UNIT,
                payload: response.data.data,
            });
            dispatch(fetchUnits(Filters.OBJ));
            dispatch(
                addToast({
                    text: getFormattedMessage("unit.success.create.message"),
                })
            );
            dispatch(addInToTotalRecord(1));
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response?.data?.message, type: toastType.ERROR })
            );
        });
};

export const editUnit = (unitId, units, handleClose) => async (dispatch) => {
    apiConfig
        .patch(apiBaseURL.UNITS + "/" + unitId, units)
        .then((response) => {
            dispatch({
                type: unitsActionType.EDIT_UNIT,
                payload: response.data.data,
            });
            handleClose(false);
            dispatch(
                addToast({
                    text: getFormattedMessage("unit.success.edit.message"),
                })
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response?.data?.message, type: toastType.ERROR })
            );
        });
};

export const deleteUnit = (unitId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.UNITS + "/" + unitId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch({ type: unitsActionType.DELETE_UNIT, payload: unitId });
            dispatch(callFetchDataApi(true));
            dispatch(
                addToast({
                    text: getFormattedMessage("unit.success.delete.message"),
                })
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response?.data?.message, type: toastType.ERROR })
            );
        });
};

export const fetchUnits = (filter = {}, isLoading = true) => async (dispatch) => {
    console.log('🚀 fetchUnits iniciado - DEBUG VERSION');
    console.log('📊 Parámetros:', { filter, isLoading });

    try {
        if (isLoading) {
            console.log('⏳ Activando loading...');
            dispatch(setLoading(true));
        }

        // Verificar configuraciones
        console.log('🔍 Verificando configuraciones...');
        console.log('  apiBaseURL:', typeof apiBaseURL, apiBaseURL);
        console.log('  apiBaseURL.UNITS:', apiBaseURL?.UNITS);
        console.log('  apiConfig:', typeof apiConfig, !!apiConfig);
        console.log('  unitsActionType:', typeof unitsActionType, unitsActionType);

        let url = apiBaseURL.UNITS;

        if (!url) {
            throw new Error('apiBaseURL.UNITS no está definido');
        }

        console.log('🌐 URL base:', url);

        // Agregar filtros si existen
        if (!_.isEmpty(filter) &&
            (filter.page || filter.pageSize || filter.search || filter.order_By || filter.created_at)) {

            console.log('🔗 Agregando parámetros al URL...');
            const params = requestParam(filter, null, null, null, url);
            url += params;
            console.log('🔗 URL con parámetros:', url);
        }

        console.log('📞 Realizando llamada HTTP...');
        const response = await apiConfig.get(url);

        console.log('📥 Respuesta HTTP exitosa:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data
        });

        if (!response.data) {
            throw new Error('La respuesta no contiene data');
        }

        if (!response.data.data) {
            throw new Error('La respuesta no contiene data.data');
        }

        console.log('📦 Data extraída:', response.data.data);
        console.log('📊 Meta extraída:', response.data.meta);

        // Dispatch principal
        console.log('📤 Despachando FETCH_UNITS...');
        dispatch({
            type: unitsActionType.FETCH_UNITS,
            payload: response.data.data,
        });
        console.log('✅ FETCH_UNITS despachado');

        // Dispatch del total
        const total = response.data.meta?.total !== undefined && response.data.meta.total >= 0
            ? response.data.meta.total
            : response.data.data.length;

        console.log('📊 Total calculado:', total);
        dispatch(setTotalRecord(total));
        console.log('✅ Total despachado');

        if (isLoading) {
            console.log('⏹️ Desactivando loading...');
            dispatch(setLoading(false));
        }

        console.log('🎉 fetchUnits completado exitosamente');

    } catch (error) {
        console.error('💥 ERROR EN fetchUnits:');
        console.error('  Mensaje:', error.message);
        console.error('  Stack:', error.stack);
        console.error('  Tipo:', error.name);

        if (error.response) {
            console.error('  Response status:', error.response.status);
            console.error('  Response data:', error.response.data);
            console.error('  Response headers:', error.response.headers);
        }

        if (error.request) {
            console.error('  Request:', error.request);
        }

        console.error('  Config:', error.config);

        // Toast de error si existe
        try {
            dispatch(
                addToast({
                    text: error.response?.data?.message || `Error: ${error.message}`,
                    type: toastType.ERROR,
                })
            );
        } catch (toastError) {
            console.error('❌ Error al mostrar toast:', toastError);
        }

        // Asegurar que loading se desactive
        if (isLoading) {
            try {
                dispatch(setLoading(false));
            } catch (loadingError) {
                console.error('❌ Error al desactivar loading:', loadingError);
            }
        }

        // Re-throw para que el componente pueda manejarlo
        throw error;
    }
};
