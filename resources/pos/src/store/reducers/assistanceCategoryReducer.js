import { assistanceCategoriesActionType } from '../../constants';

const initialState = {
    data: [],
    meta: {},
    loading: false,
    error: null
};

export default (state = initialState, action) => {
    console.log('🔄 Reducer recibió action:', action.type);
    console.log('📦 Payload del action:', action.payload);
    console.log('📊 Estado actual antes:', state);

    switch (action.type) {
        case assistanceCategoriesActionType.FETCH_ASSISTANCE_CATEGORIES_REQUEST:
            console.log('⏳ REQUEST: Iniciando carga...');
            return {
                ...state,
                loading: true,
                error: null
            };

        case assistanceCategoriesActionType.FETCH_ASSISTANCE_CATEGORIES_SUCCESS:
            console.log('✅ SUCCESS: Datos recibidos');
            console.log('🔍 Datos a guardar:', action.payload.data);
            console.log('📈 Meta info:', action.payload.meta);

            const newState = {
                ...state,
                loading: false,
                data: action.payload.data || [],
                meta: action.payload.meta || {},
                error: null
            };

            console.log('🏁 Nuevo estado después:', newState);
            return newState;

        case assistanceCategoriesActionType.ADD_ASSISTANCE_CATEGORY_REQUEST:
            console.log('⏳ ADD REQUEST: Agregando categoría de asistencia...');
            return {
                ...state,
                loading: true,
                error: null
            };

        case assistanceCategoriesActionType.ADD_ASSISTANCE_CATEGORY_SUCCESS:
            console.log('✅ ADD SUCCESS: Categoría de asistencia agregada');
            return {
                ...state,
                loading: false,
                data: [action.payload, ...state.data],
                meta: {
                    ...state.meta,
                    total: (state.meta.total || 0) + 1
                },
                error: null
            };

        case assistanceCategoriesActionType.EDIT_ASSISTANCE_CATEGORY_SUCCESS:
            console.log('✅ EDIT SUCCESS: Categoría de asistencia editada');
            return {
                ...state,
                loading: false,
                data: state.data.map(item =>
                    item.id === action.payload.id ? action.payload : item
                ),
                error: null
            };

        case assistanceCategoriesActionType.DELETE_ASSISTANCE_CATEGORY_SUCCESS:
            console.log('✅ DELETE SUCCESS: Categoría de asistencia eliminada');
            return {
                ...state,
                loading: false,
                data: state.data.filter(item => item.id !== action.payload),
                meta: {
                    ...state.meta,
                    total: (state.meta.total || 1) - 1
                },
                error: null
            };

        case assistanceCategoriesActionType.FETCH_ASSISTANCE_CATEGORIES_FAILURE:
            console.log('❌ FETCH FAILURE:', action.payload);
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case assistanceCategoriesActionType.ADD_ASSISTANCE_CATEGORY_FAILURE:
        case assistanceCategoriesActionType.EDIT_ASSISTANCE_CATEGORY_FAILURE:
        case assistanceCategoriesActionType.DELETE_ASSISTANCE_CATEGORY_FAILURE:
            console.log('❌ ACTION FAILURE:', action.payload);
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};
