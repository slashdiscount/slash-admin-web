export const LOG_IN: string = "LOG_IN";
export const LOG_OUT: string = "LOG_OUT";

export function login(user: string): ILogInActionType {
    return { type: LOG_IN, user: user };
}

export function logout(): ILogOutActionType {
    return { type: LOG_OUT};
}

interface ILogInActionType { type: string, user: string };
interface ILogOutActionType { type: string };
