import React from "react";

function UsersList(props: any): JSX.Element {
    return (
        <div className="table-responsive portlet">
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">USER NO</th>
                        <th scope="col">WALLET</th>
                        <th scope="col">NAME</th>
                        <th scope="col">CONTACT</th>
                        <th scope="col">EMAIL</th>
                        <th scope="col">TYPE</th>
                        <th scope="col">ADDRESS</th>
                        <th scope="col">DOR</th>
                        <th scope="col">REFFERED BY</th>
                        <th scope="col">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {props.users}
                </tbody>
            </table>
        </div>

    );
}

export default UsersList;
