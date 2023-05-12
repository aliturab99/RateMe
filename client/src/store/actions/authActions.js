import axios from "axios"

export const authActionType = {
    SIGN_IN: "signIn",
    SIGN_OUT: "signOut",
    AUTH_LOADED: "authLoaded",
    AUTH_FAILED: "authFailed",
    LOAD_TOKEN: "loadToken"
}

export const signin = (user, token) => ({type: authActionType.SIGN_IN, user, token})


export const loadToken = () => {
    const token = localStorage.getItem("token")
    return({
        type: authActionType.LOAD_TOKEN,
        token: token ? token : null
    })
}

export const loadAuth = () => {
    return (dispatch, getState) => {
        axios.get('/users/profile').then( ({data}) => {
            dispatch({
                type: authActionType.AUTH_LOADED,
                user: data.user
            })
        }).catch( err => {
            console.log(err)
        } )
    }
}