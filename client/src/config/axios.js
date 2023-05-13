import axios from "axios"
import { authActionType } from "../store/actions/authActions";

export const configureAxios = (store) => {
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL

  // response middleware
  axios.interceptors.request.use((config) => {
    const state = store.getState();
    config.headers.Authorization = "Bearer " + state.auth.token;
    return config;
  },err => console.log(err))

  // response middleware
  axios.interceptors.response.use(response => response,err => {
    if(err.response && err.response.status === 401) {
      store.dispatch({
        type: authActionType.AUTH_FAILED
      })
      localStorage.removeItem("token");
      return Promise.reject(new Error("Authentication failed"))
  }else{
    return Promise.reject(err)
  }
})

}
