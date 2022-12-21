import Axios, { AxiosError } from 'axios';
import React, { Dispatch, Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { timeStamp } from '../../../common/timeStamp';
import { updateCurrentPath } from '../../../store/actions/root.actions';
import UserRewardsList from './UserRewardsList';
const API_URL = process.env.REACT_APP_API_URL;

export default function UserRewards(): JSX.Element {
    const { id }: any = useParams()
    const [userRewards, setUserRewards] = useState([])

    const dispatch: Dispatch<any> = useDispatch();
    dispatch(updateCurrentPath("Users", "Reward History"));

    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    const getUserRewards = async () => {
        try {
            console.log("config",config)
            const userRewards = await Axios.get(`${API_URL}/user-reward?id=${id}`, config);
            console.log("userRewards", userRewards)
            if (userRewards && userRewards.data.status === 200) {
                setUserRewards(userRewards.data.userRewards)
            }
        } catch (error) {
            const err = error as AxiosError
                toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                    position: toast.POSITION.TOP_RIGHT
                });
        }
    };
    useEffect(() => {

        getUserRewards();
    }, []);

    let userRewardsList;
    if(userRewards && userRewards.length > 0){
        userRewardsList = userRewards.map((user, ind) => {
            return (
                <tr className={`table-row`}
                    key={`user_${user['id']}`}>
                    <th scope="row">{ind + 1}</th>
                    <td>{user['createdBy']}</td>
                    <td>{user['wallet'] && user['wallet'] !== null ? user['wallet'] : 0}</td>
                    <td>{user['reward']}</td>
                    <td>{user['type']}</td>
                    <td>{user['description']}</td>
                    <td>{timeStamp(user['createdAt'])}</td>
                </tr>);
        });
    } else {
        userRewardsList =  <tr className={`table-row align-items-center`}><th className={`align-items-center`}>No Reward History Found</th></tr>
    }
    return (
        <Fragment>
            <div className="row">
                <div className="col-xl-12 col-lg-12">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-green">Reward History</h6>
                        </div>
                        <div className="card-body">
                            <UserRewardsList userRewards = {userRewardsList}/>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

