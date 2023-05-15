import axios from "axios"
import { showError } from "./alertActions"

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
  
      const token = localStorage.getItem('token');
      // load token first
  
      // if token is not in localStoarge then dispatach Auth Failed
      if (!token) return dispatch({ type: authActionType.AUTH_FAILED });
  
      dispatch({ type: authActionType.LOAD_TOKEN, payload: token ? token : null });
  
      axios.get('/users/profile').then(result => {
        dispatch({ type: authActionType.AUTH_LOADED, payload: result.data.user })
      }).catch(error => {
        if (token)
          dispatch(showError(error.message))
      })
    }
  }