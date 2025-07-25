import apiConfig from "../../../config/apiConfig";
import {
    adminActionType,
    adminApiBaseURL,
    toastType,
} from "../../../constants";
import { fetchFrontSetting } from "../frontSettingAction";
import { setLoading } from "../loadingAction";
import { addToast } from "../toastAction";

export const fetchPaymentSettings =
    (isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        await apiConfig
            .get(`${adminApiBaseURL.PAYMENT_SETTINGS}`)
            .then((response) => {
                dispatch({
                    type: adminActionType.FETCH_PAYMENT_SETTINGS,
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

export const updatePaymentSettings =
    (data, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        await apiConfig
            .post(`${adminApiBaseURL.PAYMENT_SETTINGS}`, data)
            .then((response) => {
                if (isLoading) {
                    dispatch(setLoading(false));
                }
                dispatch(
                    addToast({
                        text: response?.data?.message,
                    })
                );
                dispatch(fetchPaymentSettings());
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

export const fetchAdminSettings =
    (isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        await apiConfig
            .get(`${adminApiBaseURL.SETTINGS}`)
            .then((response) => {
                if (isLoading) {
                    dispatch(setLoading(false));
                }
                dispatch({
                    type: adminActionType.SETTINGS,
                    payload: response.data.data,
                });
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

export const updateAdminSettings =
    (data, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        await apiConfig
            .post(`${adminApiBaseURL.SETTINGS}`, data)
            .then((response) => {
                if (isLoading) {
                    dispatch(setLoading(false));
                }
                dispatch(
                    addToast({
                        text: response?.data?.message,
                    })
                );
                dispatch(fetchAdminSettings());
                dispatch(fetchFrontSetting());
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
