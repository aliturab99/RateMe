import { progressBarActionType } from "../actions/progressBarActions"

const initState = {
    loading: false
};

const progressBarReducer = (state = initState, action) => {
    switch( action.type ){
        case progressBarActionType.LOADING:
            return {loading: true};
        case progressBarActionType.LOADED:
            return {loading: false}
        default:
            return{ state }
    }
};
export default progressBarReducer;