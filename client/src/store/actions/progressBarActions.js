export const progressBarActionType = {
    LOADING: "loading",
    LOADED: "loaded"
}

export const showProgressBar = () => ({ type: progressBarActionType.LOADING })
export const hideProgressBar = () => ({ type: progressBarActionType.LOADED })