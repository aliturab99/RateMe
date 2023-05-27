import { combineReducers } from "redux";
import alertReducer from "./alertReducer";
import authReducer from "./authReducer";
import departmentReducer from "./departmentReducer";
import progressBarReducer from "./progressBarReducer";
import userReducer from "./userReducer";

const allReducers = {
    alert: alertReducer,
    progressBar: progressBarReducer,
    auth: authReducer,
    departments: departmentReducer,
    users: userReducer,
};

const rootReducer = combineReducers(allReducers);
export default rootReducer;