import { authActionType } from "../actions/authActions";

const initState = {
    user: null,
    token: null,
    userType: null,
    isLoaded: false
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case authActionType.SIGN_IN:
            return {
                ...state,
                user: action.user,
                token: action.token,
                userType: action.user.type,
                isLoaded: true
            }
        case authActionType.LOAD_TOKEN:
            return {
                ...state,
                token: action.payload
            }
        case authActionType.AUTH_LOADED:
            return {
                ...state,
                user: action.payload,
                userType: action.payload.type,
                isLoaded: true
            }
        case authActionType.SIGN_OUT:
        case authActionType.AUTH_FAILED:
            return {
                ...state,
                user: null,
                token: null,
                userType: null,
                isLoaded: true
            }
        case authActionType.UPDATE_USER:
            return{
                ...state,
                user: action.user
            }
        default:
            return state;
    }
}
export default authReducer;