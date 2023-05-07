export const alertActionType = {
    SHOW_SUCCESS : "showSuccess",
    SHOW_ERROR : "showError",
    SHOW_INFO : "showInfo",
    SHOW_WARNING : "showWaring",
    CLEAR_ALERT: "clearAlert",
}

export const showSuccess = (message) => ({type: alertActionType.SHOW_SUCCESS, message})
export const showError = (message) => ({type: alertActionType.SHOW_ERROR, message})
export const showInfo = (message) => ({type: alertActionType.SHOW_INFO, message})
export const showWaring = (message) => ({type: alertActionType.SHOW_WARNING, message})
export const clearAlert = () => ({type: alertActionType.CLEAR_ALERT})