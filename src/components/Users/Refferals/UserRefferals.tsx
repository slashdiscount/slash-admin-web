import Axios, { AxiosError } from 'axios';
import React, { Dispatch, Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { timeStamp } from '../../../common/timeStamp';
import { updateCurrentPath } from '../../../store/actions/root.actions';
import UserRefferalsList from './UserRefferalsList';
const API_URL = process.env.REACT_APP_API_URL;

export default function UserRefferals() : JSX.Element {
    const { id }: any = useParams()
    const [userRefferals, setUserRefferals] = useState([])

    const dispatch: Dispatch<any> = useDispatch();
    dispatch(updateCurrentPath("Users", "Refferal List"));

    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    const getUserRefferals = async () => {
        try {
            const userRefferals = await Axios.get(`${API_URL}/user-refferals?id=${id}`, config);
            console.log("userRefferals", userRefferals)
            if (userRefferals && userRefferals.data.status === 200) {
                setUserRefferals(userRefferals.data.userRefferals)
            }
        } catch (error) {
            const err = error as AxiosError
                toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                    position: toast.POSITION.TOP_RIGHT
                });
        }
    };
    useEffect(() => {

        getUserRefferals();
    }, [id]);

    const usersRefferalsList = userRefferals && userRefferals.length > 0 ? userRefferals.map((user, ind) => {
        return (
            <tr className={`table-row`}
                key={`user_${user['id']}`}>
                <th scope="row">{ind + 1}</th>
                <td>{user['id']}</td>
                <td>{user['wallet'] && user['wallet'] !== null ? user['wallet'] : 0}</td>
                <td>{user['name']}<Link to={`/user-refferals/${user['id']}`}><i className="fa fa-link" aria-hidden="true" style={{"fontSize" :"15px","float" : "right","marginTop" : "5px"}}></i></Link></td>
                <td>{user['contact']}</td>
                <td>{user['email']}</td>
                <td>{user['type']}</td>
                <td>{user['address']}</td>
                <td>{timeStamp(user['createdAt'])}</td>
                <td>{user['refferedby'] && user['refferedby'] !== null ? user['refferedby'] : ''}</td>
            </tr>);
    }) : <tr className={`table-row align-items-center`}><th className={`align-items-center`}>No Refferals Found</th></tr>;
  return (
    <Fragment>
    <div className="row">
        <div className="col-xl-12 col-lg-12">
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-green">Refferal List</h6>
                </div>
                <div className="card-body">
                    <UserRefferalsList userRefferals = {usersRefferalsList}/>
                </div>
            </div>
        </div>
    </div>
</Fragment>
  )
}
