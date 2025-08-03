import { unitsActionType } from '../../constants';

const initialState = [];

const processJsonApiUnits = (apiData) => {
    console.log('🔄 processJsonApiUnits - Procesando:', apiData);

    if (!apiData) {
        console.warn('⚠️ apiData es null/undefined');
        return [];
    }

    if (!Array.isArray(apiData)) {
        console.warn('⚠️ apiData no es un array:', typeof apiData, apiData);
        return [];
    }

    const processedUnits = apiData.map((item, index) => {
        console.log(`📋 Procesando item ${index}:`, item);

        if (item.name && item.short_name && !item.attributes) {
            console.log(`✅ Item ${index} ya está en formato simple`);
            return {
                id: parseInt(item.id),
                name: item.name,
                short_name: item.short_name,
                base_unit: item.base_unit || null,
                created_at: item.created_at || null
            };
        }

        if (item.attributes) {
            const unit = {
                id: parseInt(item.id),
                name: item.attributes.name || 'Sin nombre',
                short_name: item.attributes.short_name || 'N/A',
                base_unit: item.attributes.base_unit || null,
                created_at: item.attributes.created_at || null,
                base_unit_name: item.attributes.base_unit_name || null
            };
            console.log(`✅ Item ${index} procesado de JSON:API:`, unit);
            return unit;
        }

        // Fallback
        console.warn(`⚠️ Item ${index} en formato desconocido:`, item);
        return {
            id: item.id || index,
            name: item.name || 'Desconocido',
            short_name: item.short_name || 'N/A'
        };
    });

    console.log(`✅ processJsonApiUnits completado: ${processedUnits.length} items`);
    return processedUnits;
};

const unitsReducer = (state = initialState, action) => {
    console.log('🔄 UnitsReducer - Estado actual:', state);
    console.log('🔄 UnitsReducer - Acción recibida:', action.type, action.payload);

    // Asegurar que siempre devolvemos un array
    if (state === undefined) {
        console.log('⚠️ Estado undefined, usando initialState');
        state = initialState;
    }

    switch (action.type) {
        case unitsActionType.FETCH_UNITS:
            console.log('📦 FETCH_UNITS - Datos RAW:', action.payload);

            try {
                const processedData = processJsonApiUnits(action.payload);
                console.log('📦 FETCH_UNITS - Datos procesados:', processedData);

                // Asegurar que devolvemos un array válido
                return Array.isArray(processedData) ? processedData : [];

            } catch (error) {
                console.error('❌ Error en FETCH_UNITS:', error);
                return state; // Mantener estado anterior
            }

        case unitsActionType.FETCH_UNIT:
            console.log('📦 FETCH_UNIT - Dato individual:', action.payload);

            try {
                const processedSingle = Array.isArray(action.payload)
                    ? processJsonApiUnits(action.payload)
                    : processJsonApiUnits([action.payload]);

                return Array.isArray(processedSingle) ? processedSingle : [action.payload];
            } catch (error) {
                console.error('❌ Error en FETCH_UNIT:', error);
                return state;
            }

        case unitsActionType.ADD_UNIT:
            console.log('➕ ADD_UNIT:', action.payload);

            try {
                const newUnit = action.payload.attributes
                    ? processJsonApiUnits([action.payload])[0]
                    : action.payload;

                const newState = state.length >= 10
                    ? [newUnit, ...state.slice(0, -1)]
                    : [newUnit, ...state];

                return Array.isArray(newState) ? newState : state;
            } catch (error) {
                console.error('❌ Error en ADD_UNIT:', error);
                return state;
            }

        case unitsActionType.EDIT_UNIT:
            console.log('✏️ EDIT_UNIT:', action.payload);

            try {
                const editedUnit = action.payload.attributes
                    ? processJsonApiUnits([action.payload])[0]
                    : action.payload;

                const newState = state.map(item => item.id === +editedUnit.id ? editedUnit : item);
                return Array.isArray(newState) ? newState : state;
            } catch (error) {
                console.error('❌ Error en EDIT_UNIT:', error);
                return state;
            }

        case unitsActionType.DELETE_UNIT:
            console.log('🗑️ DELETE_UNIT:', action.payload);

            try {
                const newState = state.filter(item => item.id !== action.payload);
                return Array.isArray(newState) ? newState : state;
            } catch (error) {
                console.error('❌ Error en DELETE_UNIT:', error);
                return state;
            }

        default:
            console.log('🔄 UnitsReducer - Acción no manejada, devolviendo estado actual');
            return state;
    }
};

if (process.env.NODE_ENV === 'development') {
    console.log('🔧 unitsReducer.js cargado correctamente');
    console.log('🔧 initialState:', initialState);
    console.log('🔧 Tipo de initialState:', typeof initialState);
    console.log('🔧 Es array initialState:', Array.isArray(initialState));

    const testResult = unitsReducer(undefined, { type: '@@INIT' });
    console.log('🧪 Test de inicialización:', testResult);
    console.log('🧪 Tipo del resultado:', typeof testResult);
    console.log('🧪 Es array el resultado:', Array.isArray(testResult));
}

export default unitsReducer;
