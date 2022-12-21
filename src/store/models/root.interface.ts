import { INotification } from "./notification.interface";
import { IAccount } from "./account.interface";

export interface IRootPageStateType {
    area: string;
    subArea: string;
}

export interface IRootStateType {
    page: IRootPageStateType;
}
export interface IStateType {
    root: IRootStateType;
    notifications: INotificationState;
    account: IAccount;
    searchResult : ISearchResultState;
    bulkCheckBox : IBulkCheckBoxState
}

export interface IActionBase {
    type: string;
    [prop: string]: any;
}

export interface INotificationState {
    notifications: INotification[];
}

export interface ISearchResultState {
    commonSearchReducer: any;
}

export interface IBulkCheckBoxState {
    bulkCheckBoxReducer: any;
}