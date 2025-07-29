import apiConfig from "../../config/apiConfig";
import { apiBaseURL, asistancesActionType, assistanceCategoriesActionType, errorMessage, toastType } from "../../constants";
import { addToast } from "./toastAction";
import { setLoading } from "./loadingAction";
import { removeFromTotalRecord, setTotalRecord } from "./totalRecordAction";
import requestParam from "../../shared/requestParam";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";
import { callFetchDataApi } from "./updateBrand";
import { update } from "lodash";

export const fetchAssistanceCategories = (filter = {}, isLoading = true) => async (dispatch) => {
    dispatch({
        type: assistanceCategoriesActionType.FETCH_ASSISTANCE_CATEGORIES_REQUEST
    });

    if (isLoading) {
        dispatch(setLoading(true));
    }

    let url = apiBaseURL.ASSISTANCE_CATEGORIES;
    if (filter.page || filter.pageSize || filter.search || filter.order_by) {
        url += requestParam(filter);
    }

    try {
        const response = await apiConfig.get(url);
        console.log('📥 Respuesta del servidor:', response.data); // ✅

        const processedData = response.data.data.map((item) => ({
            id: item.id,
            name: item.attributes.name,
            description: item.attributes.description,
            is_active: item.attributes.is_active || false,
            createdAt: item.attributes.created_at || null,
            updatedAt: item.attributes.updated_at || null
        }));

        dispatch({
            type: assistanceCategoriesActionType.FETCH_ASSISTANCE_CATEGORIES_SUCCESS,
            payload: {
                data: processedData,
                meta: response.data.meta,
            },
        });

        dispatch(setTotalRecord(response.data.meta?.total || 0));

        if (isLoading) {
            dispatch(setLoading(false));
        }
        return processedData;

    } catch (error) {
        dispatch(
            addToast({
                text: error?.response?.data?.message || "Failed to fetch assistance categories",
                type: toastType.ERROR,
            })
        );
    } finally {
        if (isLoading) {
            dispatch(setLoading(false));
        }
    }
};

export const fetchAssistanceCategory =
    (assistanceCategoryId, singleAssistanceCategory, isLoading = true) => async (dispatch) => {
        if (isLoading) dispatch(setLoading(true));

        apiConfig
            .get(apiBaseURL.ASSISTANCE_CATEGORIES + "/" + assistanceCategoryId,
                singleAssistanceCategory
            ).then((response) => {
                console.log('📥 Respuesta del servidor:', response.data); // ✅
                dispatch({
                    type: assistanceCategoriesActionType.FETCH_ASSISTANCE_CATEGORY_SUCCESS, // ✅ Tipo correcto
                    payload: response.data.data,
                });
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            }).catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response?.data?.message || 'Error al cargar categoría',
                        type: toastType.ERROR,
                    })
                );
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            });
    };

export const addAssistanceCategory = (assistanceCategory) => async (dispatch) => {
    try {
        dispatch({ type: assistanceCategoriesActionType.ADD_ASSISTANCE_CATEGORY_REQUEST });
        const response = await apiConfig.post(apiBaseURL.ASSISTANCE_CATEGORIES, assistanceCategory);
        console.log('📥 Respuesta del servidor:', response.data); // ✅
        let processedData;

        if (response.data.data && response.data.data.attributes) {
            processedData = {
                id: response.data.data.id,
                name: response.data.data.attributes.name,
                description: response.data.data.attributes.description,
                is_active: response.data.data.attributes.is_active || false,
                createdAt: response.data.data.attributes.created_at || null,
                updatedAt: response.data.data.attributes.updated_at || null
            };
        } else {
            processedData = {
                id: response.data.id,
                name: response.data.name,
                description: response.data.description,
                is_active: response.data.is_active || false,
                createdAt: response.data.created_at || null,
                updatedAt: response.data.updated_at || null
            };
        }

        dispatch({
            type: assistanceCategoriesActionType.ADD_ASSISTANCE_CATEGORY_SUCCESS,
            payload: processedData,
        });

        dispatch(
            addToast({
                text: getFormattedMessage("assistance-category.success.create.message") || "Categoría de Servicio creada exitosamente",
            })
        );

        return processedData;

    } catch (error) {

        const errorMessage = error?.response?.data?.message || "Error al crear la categoría de servicio";
        dispatch({
            type: assistanceCategoriesActionType.ADD_ASSISTANCE_CATEGORY_FAILURE,
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



export const editAssistanceCategory =
    (assistanceCategoryId, assistanceCategory, navigate) => async (dispatch) => {
        dispatch(setSavingButton(true));
        apiConfig
            .put(apiBaseURL.ASSISTANCE_CATEGORIES + "/" + assistanceCategoryId, assistanceCategory)
            .then((response) => {
                dispatch({
                    type: assistanceCategoriesActionType.EDIT_ASSISTANCE_CATEGORY_SUCCESS,
                    payload: response.data.data,
                });
                dispatch(
                    addToast({
                        text: getFormattedMessage("assistance-category.success.edit.message"),
                        type: toastType.SUCCESS,
                    })
                );
                navigate("/assistance-categories");
            })
            .catch(({ response }) => {
                const message = response?.data?.message || "Ocurrió un error al editar la categoría.";
                dispatch(
                    addToast({
                        text: message,
                        type: toastType.ERROR,
                    })
                );
            })
            .finally(() => {
                dispatch(setSavingButton(false));
            });
    };


export const deleteAssistanceCategory = (assistanceCategoryId) => async (dispatch) => {
    await apiConfig
        .delete(apiBaseURL.ASSISTANCE_CATEGORIES + "/" + assistanceCategoryId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch(
                addToast({
                    type: asistancesActionType.DELETE_ASSISTANCE_SUCCESS,
                    text: getFormattedMessage("assistance-category.success.delete.message"),
                })
            );
            dispatch({
                type: assistanceCategoriesActionType.DELETE_ASSISTANCE_CATEGORY_SUCCESS,
                payload: assistanceCategoryId,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({
                    text: response?.data?.message,
                    type: toastType.ERROR,
                })
            );
        });
};

export const fetchAssistanceCategoryDetail = (id) => async (dispatch) => {
    try {
        const response = await apiConfig.get(`${apiBaseURL.ASSISTANCE_CATEGORIES}/${id}`);

        let processedData;

        if (response.data && response.data.data) {
            processedData = {
                id: response.data.data.id,
                name: response.data.data.name,
                description: response.data.data.description,
                is_active: response.data.data.is_active,
                created_at: response.data.data.created_at,
                updated_at: response.data.data.updated_at
            };
        }
        else {
            processedData = {
                id: response.data.id,
                name: response.data.name,
                description: response.data.description,
                is_active: response.data.is_active,
                created_at: response.data.created_at,
                updated_at: response.data.updated_at
            };
        }

        dispatch({
            type: 'FETCH_ASSISTANCE_CATEGORY_DETAIL_SUCCESS',
            payload: processedData,
        });

    } catch (error) {
        dispatch({
            type: 'FETCH_ASSISTANCE_CATEGORY_DETAIL_FAILURE',
            payload: errorMessage
        });

        dispatch(
            addToast({
                text: error?.response?.data?.message || "Error al cargar los detalles de la categoría",
                type: toastType.ERROR,
            })
        );
    }
};
