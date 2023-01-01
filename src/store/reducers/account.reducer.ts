import { IActionBase } from "../models/root.interface";
import { IAccount } from "../models/account.interface";
import { LOG_IN, LOG_OUT } from "../actions/account.actions";

const initialState: IAccount = {
    user: localStorage.getItem('user') ? localStorage.getItem('user') : 'admin',
};

function accountReducer(state: IAccount = initialState, action: IActionBase): IAccount {
    console.log("coming here every time",state);
    switch (action.type) {
        case LOG_IN: {
            return { ...state, user: (action.user)};
        }
        case LOG_OUT: {
            return { ...state, user: ""};
        }
        default:
            return state;
    }
}


export default accountReducer;