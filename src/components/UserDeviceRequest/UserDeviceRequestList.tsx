import React from "react";

function UsersDeviceDetailList(props: any): JSX.Element {
    return (
        <div className="table-responsive portlet">
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">USER NO</th>
                        <th scope="col">NAME</th>
                        <th scope="col">CONTACT</th>
                        <th scope="col">STATUS</th>
                        <th scope="col">Req.Model</th>
                        <th scope="col">Req.App Version</th>
                        <th scope="col">Req Date</th>
                        <th scope="col">HISTORY</th>
                    </tr>
                </thead>
                <tbody>
                    {props.usersDeviceDetails}
                </tbody>
            </table>
        </div>

    );
}

export default UsersDeviceDetailList;
