import { alertActionType } from "../actions/alertActions"

const initState = {
    success: null,
    error: null,
    info: null,
    waring: null
}


const alertReducer = (state = initState, action) => {
    switch(action.type){
        case alertActionType.SHOW_SUCCESS:
            return{
                ...state,
                success: action.message
            }
        case alertActionType.SHOW_ERROR:
            return{
                ...state,
                error: action.message
            }
        case alertActionType.SHOW_INFO:
            return{
                ...state,
                info: action.message
            }
        case alertActionType.SHOW_WARNING:
            return{
                ...state,
                waring: action.waring
            }
        case alertActionType.CLEAR_ALERT:
            return initState
        default:
            return state
    }
}

export default alertReducer;