import axios from "axios"

export const authActionType = {
    SIGN_IN: "signIn",
    SIGN_OUT: "signOut",
    AUTH_LOADED: "authLoaded",
    AUTH_FAILED: "authFailed",
    LOAD_TOKEN: "loadToken"
}

export const signin = (user, token) => ({type: authActionType.SIGN_IN, user, token})

export const signOut = () => {
    localStorage.removeItem("token")
    return {
        type: authActionType.SIGN_OUT
    }
}

export const loadAuth = () => {
    return (dispatch, getState) => {


        const token = localStorage.getItem("token")
        dispatch(({
            type: authActionType.LOAD_TOKEN,
            token: token ? token : null
        }))



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