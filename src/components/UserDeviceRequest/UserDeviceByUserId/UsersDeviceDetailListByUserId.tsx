import React from "react";

function UsersDeviceDetailListByUserId(props: any): JSX.Element {
    return (
        <div className="table-responsive portlet">
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Req.Model</th>
                        <th scope="col">Req.App Version</th>
                        <th scope="col">Req Date</th>
                    </tr>
                </thead>
                <tbody>
                    {props.usersDeviceDetails}
                </tbody>
            </table>
        </div>

    );
}

export default UsersDeviceDetailListByUserId;
