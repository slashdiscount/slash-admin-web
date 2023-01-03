import {  IActionBase } from "../models/root.interface";
import {  COMMON_SEARCH } from "../actions/commonSearch.actions";

const initialState: any = {

};

function commonSearchReducer(state: any = initialState, action: IActionBase): any {
    switch (action.type) {
        case COMMON_SEARCH : {
            console.log("reducer in commonSearch",action, state)
            return action.data;
        }
        default:
            return state;
    }
}

export default commonSearchReducer;