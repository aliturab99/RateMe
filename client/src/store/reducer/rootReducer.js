import { combineReducers } from "redux";
import alertReducer from "./alertReducer";
import authReducer from "./authReducer";
import progressBarReducer from "./progressBarReducer";

const allReducers = {
    alert: alertReducer,
    progressBar: progressBarReducer,
    auth: authReducer
};

const rootReducer = combineReducers(allReducers);
export default rootReducer;