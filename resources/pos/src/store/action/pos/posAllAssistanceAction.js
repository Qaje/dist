import { apiBaseURL, asistancesActionType } from "../../../constants";
import apiConfig from "../../../config/apiConfig";
// import { setLoading } from "../progressBarAction"; // Comentado temporalmente

// Función temporal para setLoading
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
    if (resetPage) {
        dispatch(setLoading(true));
        dispatch({ type: asistancesActionType.RESET_ASSISTANCE });
    }

    const currentAssistances = getState().posAllAssistances || [];

    try {
        let url = `${apiBaseURL.ASSISTANCES}?`;

        // Construir parámetros de la URL
        const params = new URLSearchParams();

        if (assistanceCategoryId) {
            params.append('filter[assistance_category_id]', assistanceCategoryId);
        }

        if (warehouseId) {
            params.append('warehouse_id', warehouseId);
        }

        if (search) {
            params.append('filter[search]', search);
        }

        params.append('page[size]', '30');
        params.append('page[number]', page);

        url += params.toString();

        console.log('Fetching assistances from:', url);

        const response = await apiConfig.get(url);

        if (response.data && response.data.data) {
            let assistances = response.data.data;

            // Si no es la primera página y no es un reset, agregar a las existentes
            if (page > 1 && !resetPage) {
                assistances = [...currentAssistances, ...assistances];
            }

            dispatch({
                type: asistancesActionType.FETCH_ASSISTANCE_CLICKABLE,
                payload: assistances,
            });
        }

        dispatch(setLoading(false));
    } catch (error) {
        console.error('Error fetching assistances:', error);
        dispatch(setLoading(false));

        // Si hay error, mostrar mensaje en consola
        if (error.response?.status === 404) {
            console.warn('Assistance API endpoint not found. Check if /api/asistences exists.');
        }
    }
};

export const posAllAssistance = (filter = {}) => async (dispatch) => {
    try {
        let url = `${apiBaseURL.ASSISTANCES}?page[size]=0`;

        if (filter && Object.keys(filter).length > 0) {
            const params = new URLSearchParams();
            Object.keys(filter).forEach(key => {
                if (filter[key] !== null && filter[key] !== undefined && filter[key] !== '') {
                    params.append(key, filter[key]);
                }
            });
            url += '&' + params.toString();
        }

        console.log('Fetching all assistances from:', url);

        const response = await apiConfig.get(url);

        if (response.data && response.data.data) {
            dispatch({
                type: asistancesActionType.POS_ALL_ASSISTANCE,
                payload: response.data.data,
            });
        }
    } catch (error) {
        console.error('Error fetching all assistances:', error);

        if (error.response?.status === 404) {
            console.warn('Assistance API endpoint not found. Check if /api/asistences exists.');
        }
    }
};

// import { apiBaseURL, asistancesActionType } from "../../../constants";
// import apiConfig from "../../../config/apiConfig";
// import { setLoading } from "../../progressBarAction";
//
// export const fetchAssistanceClickable = (
//     assistanceCategoryId = null,
//     warehouseId = null,
//     page = 1,
//     search = "",
//     resetPage = false
// ) => async (dispatch, getState) => {
//     if (resetPage) {
//         dispatch(setLoading(true));
//         dispatch({ type: asistancesActionType.RESET_ASSISTANCE });
//     }
//
//     const currentAssistances = getState().posAllAssistances || [];
//
//     try {
//         let url = `${apiBaseURL.ASSISTANCES}?`;
//
//         // Construir parámetros de la URL
//         const params = new URLSearchParams();
//
//         if (assistanceCategoryId) {
//             params.append('filter[assistance_category_id]', assistanceCategoryId);
//         }
//
//         if (warehouseId) {
//             params.append('warehouse_id', warehouseId);
//         }
//
//         if (search) {
//             params.append('filter[search]', search);
//         }
//
//         params.append('page[size]', '30');
//         params.append('page[number]', page);
//
//         url += params.toString();
//
//         console.log('Fetching assistances from:', url);
//
//         const response = await apiConfig.get(url);
//
//         if (response.data && response.data.data) {
//             let assistances = response.data.data;
//
//             // Si no es la primera página y no es un reset, agregar a las existentes
//             if (page > 1 && !resetPage) {
//                 assistances = [...currentAssistances, ...assistances];
//             }
//
//             dispatch({
//                 type: asistancesActionType.FETCH_ASSISTANCE_CLICKABLE,
//                 payload: assistances,
//             });
//         }
//
//         dispatch(setLoading(false));
//     } catch (error) {
//         console.error('Error fetching assistances:', error);
//         dispatch(setLoading(false));
//
//         // Si hay error, mostrar mensaje en consola
//         if (error.response?.status === 404) {
//             console.warn('Assistance API endpoint not found. Check if /api/asistences exists.');
//         }
//     }
// };
//
// export const posAllAssistance = (filter = {}) => async (dispatch) => {
//     try {
//         let url = `${apiBaseURL.ASSISTANCES}?page[size]=0`;
//
//         if (filter && Object.keys(filter).length > 0) {
//             const params = new URLSearchParams();
//             Object.keys(filter).forEach(key => {
//                 if (filter[key] !== null && filter[key] !== undefined && filter[key] !== '') {
//                     params.append(key, filter[key]);
//                 }
//             });
//             url += '&' + params.toString();
//         }
//
//         console.log('Fetching all assistances from:', url);
//
//         const response = await apiConfig.get(url);
//
//         if (response.data && response.data.data) {
//             dispatch({
//                 type: asistancesActionType.POS_ALL_ASSISTANCE,
//                 payload: response.data.data,
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching all assistances:', error);
//
//         if (error.response?.status === 404) {
//             console.warn('Assistance API endpoint not found. Check if /api/asistences exists.');
//         }
//     }
// };
