import { authActionType } from "../actions/authActions";

const initState = {
    user: null,
    token: null,
    userType: null,
    isLoaded: false
}

const authReducer = (state = initState, action) => {
    switch(action.type){
        case authActionType.SIGN_IN:
            return{
                ...state,
                user: action.user,
                token: action.token,
                userType: action.user.type,
                isLoaded: true
            }
        case authActionType.LOAD_TOKEN:
            return{
                ...state,
                token: action.token
            }
        case authActionType.AUTH_LOADED:
            console.log(action)
            return{
                ...state,
                user: action.user,
                userType: action.user.type,
                isLoaded: true
            }
        default:
            return state;
    }
}
export default authReducer;