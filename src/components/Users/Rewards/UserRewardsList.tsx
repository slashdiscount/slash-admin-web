import React from 'react'

export default function UserRewardsList(props: any): JSX.Element {
    return (
        <div className="table-responsive portlet">
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">USER NO</th>
                        <th scope="col">TRANSACTION ID</th>
                        <th scope="col">REWARD</th>
                        <th scope="col">TYPE</th>
                        <th scope="col">DESCRIPTION</th>
                        <th scope="col">DATE</th>
                    </tr>
                </thead>
                <tbody>
                    {props.userRewards}
                </tbody>
            </table>
        </div>
    )
}
