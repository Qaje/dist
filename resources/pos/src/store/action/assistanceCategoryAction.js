import { assistanceCategoryActionType, toastType } from "../../constants";
import apiConfig from "../../config/apiConfig";
import { addToast } from "./toastAction";
import { setLoading } from "./loadingAction";

export const fetchAssistanceCategories = (isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true));
    }

    await apiConfig
        .get(`assistance-categories`)
        .then((response) => {
            dispatch({
                type: assistanceCategoryActionType.FETCH_ASSISTANCE_CATEGORIES,
                payload: response.data.data,
            });
            if (isLoading) {
                dispatch(setLoading(false));
            }
        })
        .catch(({ response }) => {
            dispatch(
                addToast({
                    text: response?.data?.message || "Error fetching assistance categories",
                    type: toastType.ERROR,
                })
            );
            if (isLoading) {
                dispatch(setLoading(false));
            }
        });
};

export const fetchAssistanceCategory = (assistanceCategoryId, singleAssistanceCategory) => async (dispatch) => {
    dispatch(setLoading(true));
    await apiConfig
        .get(`assistance-categories/${assistanceCategoryId}`, singleAssistanceCategory)
        .then((response) => {
            dispatch({
                type: assistanceCategoryActionType.FETCH_ASSISTANCE_CATEGORY,
                payload: response.data.data,
            });
            dispatch(setLoading(false));
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

export const addAssistanceCategory = (assistanceCategory, navigate) => async (dispatch) => {
    await apiConfig
        .post("assistance-categories", assistanceCategory)
        .then((response) => {
            dispatch({
                type: assistanceCategoryActionType.ADD_ASSISTANCE_CATEGORY,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage("assistance-category.success.create.message"),
                    type: toastType.SUCCESS,
                })
            );
            navigate("/app/assistance-categories");
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

export const editAssistanceCategory = (assistanceCategoryId, assistanceCategory, navigate) => async (dispatch) => {
    await apiConfig
        .patch(`assistance-categories/${assistanceCategoryId}`, assistanceCategory)
        .then((response) => {
            dispatch({
                type: assistanceCategoryActionType.EDIT_ASSISTANCE_CATEGORY,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage("assistance-category.success.edit.message"),
                    type: toastType.SUCCESS,
                })
            );
            navigate("/app/assistance-categories");
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

export const deleteAssistanceCategory = (assistanceCategoryId) => async (dispatch) => {
    await apiConfig
        .delete(`assistance-categories/${assistanceCategoryId}`)
        .then((response) => {
            dispatch(
                addToast({
                    text: getFormattedMessage("assistance-category.success.delete.message"),
                    type: toastType.SUCCESS,
                })
            );
            dispatch({
                type: assistanceCategoryActionType.DELETE_ASSISTANCE_CATEGORY,
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
