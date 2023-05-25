import { combineReducers } from "redux";
import alertReducer from "./alertReducer";
import authReducer from "./authReducer";
import departmentReducer from "./departmentReducer";
import progressBarReducer from "./progressBarReducer";

const allReducers = {
    alert: alertReducer,
    progressBar: progressBarReducer,
    auth: authReducer,
    departments: departmentReducer,
};

const rootReducer = combineReducers(allReducers);
export default rootReducer;