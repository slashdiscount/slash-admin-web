import { combineReducers, Reducer } from "redux";
import { UPDATE_CURRENT_PATH } from "../actions/root.actions";
import { IRootStateType, IActionBase, IStateType } from "../models/root.interface";
import notificationReducer from "./notification.reducer";
import accountReducer from "./account.reducer";
import commonSearchReducer from "./commonSearch.reducer";
import bulkCheckBoxReducer from "./bulkCheckBox.reducer";


const initialState: IRootStateType = {
    page: {area: "home", subArea: ""}
};

function rootReducer(state: IRootStateType = initialState, action: IActionBase): IRootStateType {
    switch (action.type) {
        case UPDATE_CURRENT_PATH:
            return { ...state, page: {area: action.area, subArea: action.subArea}};
        default:
            return state;
    }
}

const rootReducers: Reducer<IStateType> = combineReducers({root: rootReducer,
    notifications: notificationReducer,
    account: accountReducer,
    searchResult : commonSearchReducer,
    bulkCheckBox : bulkCheckBoxReducer
});



export default rootReducers;