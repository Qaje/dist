// Action creators
export const setLoading = (loading) => ({
    type: PROGRESS_BAR_ACTION_TYPE.SET_LOADING,
    payload: loading
});

export const showProgress = () => ({
    type: PROGRESS_BAR_ACTION_TYPE.SHOW_PROGRESS,
    payload: true
});

export const hideProgress = () => ({
    type: PROGRESS_BAR_ACTION_TYPE.HIDE_PROGRESS,
    payload: false
});

// Thunk action for async operations
export const withLoading = (asyncAction) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        await dispatch(asyncAction);
    } finally {
        dispatch(setLoading(false));
    }
};
