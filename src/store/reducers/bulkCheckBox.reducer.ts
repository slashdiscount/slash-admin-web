import { IActionBase } from "../models/root.interface";
import {HANDLE_BULK_CHECKBOX } from "../actions/handleBulkCheckbox.action";

const initialState: any = {
    bulkDeleteIds : []
};

function bulkCheckBoxReducer(state: any = initialState, action: IActionBase): any {
    switch (action.type) {
        case HANDLE_BULK_CHECKBOX : {
            console.log("reducer in bulk delete",action, state)
            const { checked, value, bulkDeleteApi, bulkHardDeleteApi, renderPageFunction,page } = action.data;
            if(checked ){

                return {
                    bulkDeleteApi,
                    bulkHardDeleteApi,
                    renderPageFunction,
                    page,
                    bulkDeleteIds : [...state.bulkDeleteIds,value]
                }
            } else {
                return {
                    bulkDeleteApi,
                    bulkHardDeleteApi,
                    renderPageFunction,
                    page,
                    bulkDeleteIds : [...state.bulkDeleteIds.filter((e : any) => e !== value)]
                }
            }
        }
        default:
            return state;
    }
}

export default bulkCheckBoxReducer;