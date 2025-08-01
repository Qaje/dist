// store/reducers/posAllAssistanceReducer.js
import { asistancesActionType, posAssistanceActionType } from "../../constants";

const initialState = [];

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case asistancesActionType.FETCH_ASSISTANCE_CLICKABLE:
            console.log('🔄 Reducer: FETCH_ASSISTANCE_CLICKABLE', payload?.length || 0);
            return Array.isArray(payload) ? payload : [];

        case asistancesActionType.RESET_ASSISTANCE:
            console.log('🔄 Reducer: RESET_ASSISTANCE');
            return [];

        case posAssistanceActionType.POS_ALL_ASSISTANCE:
            console.log('🔄 Reducer: POS_ALL_ASSISTANCE', payload?.length || 0);
            return Array.isArray(payload) ? payload : [];

        case asistancesActionType.FETCH_ASSISTANCE_ERROR:
        case posAssistanceActionType.POS_ALL_ASSISTANCE_ERROR:
            console.error('❌ Reducer: Assistance Error', payload);
            return [];

        default:
            return state;
    }
};

// store/reducers/asistancesReducer.js (para la página de gestión)
const asistancesInitialState = {
    data: [],
    meta: {
        total: 0,
        current_page: 1,
        per_page: 15,
        last_page: 1
    },
    loading: false,
    error: null
};

export const asistancesReducer = (state = asistancesInitialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'FETCH_ASSISTANCES_REQUEST':
            return {
                ...state,
                loading: true,
                error: null
            };

        case 'FETCH_ASSISTANCES_SUCCESS':
            return {
                ...state,
                loading: false,
                data: payload.data || [],
                meta: payload.meta || state.meta,
                error: null
            };

        case 'FETCH_ASSISTANCES_ERROR':
            return {
                ...state,
                loading: false,
                error: payload,
                data: []
            };

        case 'SET_LOADING':
            return {
                ...state,
                loading: payload
            };

        default:
            return state;
    }
};
