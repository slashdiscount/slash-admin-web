import { Route, Redirect, RouteProps } from "react-router";
import React from "react";
import { useSelector } from "react-redux";
import { IStateType } from "../../store/models/root.interface";
import { IAccount } from "../../store/models/account.interface";
import Login from "../../components/Account/Login";


export function AccountRoute({ children, ...rest }: RouteProps): JSX.Element {

    // const account: IAccount = useSelector((state: IStateType) => state.account);
    const token = localStorage.getItem('token');

    return (
        <Route
            {...rest}
            render={() =>
                token && token !== '' ? (
                    <Redirect
                        to={{
                            pathname: "/admin/home"
                        }}
                    />
                ) : <Login />
            }
        />
    );
}