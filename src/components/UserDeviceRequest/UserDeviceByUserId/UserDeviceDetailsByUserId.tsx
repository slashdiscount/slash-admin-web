import Axios, { AxiosError } from 'axios';
import React, { Dispatch, Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import CommonButton from '../../../common/components/CommonButton';
import Paginate from '../../../common/components/Paginate';
import { logout } from '../../../store/actions/account.actions';
import { updateCurrentPath } from '../../../store/actions/root.actions';
import { timeStamp } from '../../../common/timeStamp';
import UsersDeviceDetailListByUserId from "./UsersDeviceDetailListByUserId"
const API_URL = process.env.REACT_APP_API_URL;


const UserDeviceListByUserId: React.FC = () => {
    const history = useHistory();
    const searchLocation = useLocation().search;
    const userId = new URLSearchParams(searchLocation).get('userId');
    const [userDeviceDetails, setUserDeviceDetails] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');


    const id = userId !== null ? JSON.parse(userId) : null;

    const dispatch: Dispatch<any> = useDispatch();
    dispatch(updateCurrentPath(`User Devices Request By User Id`, "List"));

    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }
    let limit: number = 20;
    const getDeviceDetails = async () => {
        try {
            const deviceDetails = await Axios.post(`${API_URL}/users-device-details-by-userId`, { id }, config);
            console.log("deviceDetails", deviceDetails);
            if (deviceDetails.status === 201 || deviceDetails.status === 200) {
                console.log("name", deviceDetails.data.deviceDetails.details[0].name);
                setName(deviceDetails.data.deviceDetails.details[0].name)
                console.log("contact", deviceDetails.data.deviceDetails.details[0].contact);
                setContact(deviceDetails.data.deviceDetails.details[0].contact)
                setUserDeviceDetails(deviceDetails.data.deviceDetails.details);
                setpageCount(Math.ceil(deviceDetails.data.deviceDetails.size / limit))
                toast.success(deviceDetails.data.message ? deviceDetails.data.message : 'Fetched Successfully', {
                    position: toast.POSITION.TOP_RIGHT
                });
            }

        } catch (error) {
            const err = error as AxiosError
            if (err && err.response && err.response.data.statusCode === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                dispatch(logout())
                history.push('/login')
                toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {

                toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    }

    useEffect(() => {
        getDeviceDetails();
    }, [])

    const fetchSkipUsers = async (page: number) => {
        try {
            let skippedUsers = await Axios.post(`${API_URL}/users-device-details-by-userId?page=${page}`, {id},config);
            return skippedUsers.data.deviceDetails.details
        } catch (error) {
            const err = error as AxiosError
            toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    };
    const handlePageClick = async (data: any) => {
        console.log("data selected", data.selected)
        const users = await fetchSkipUsers(data.selected + 1);
        console.log("users", users)
        setUserDeviceDetails(users);

    };

    let usersDetails = userDeviceDetails.map((user, ind) => {
        return (
            <tr className={`table-row`}
                key={`user_${ind}`}>
                <th scope="row">{ind + 1}</th>
                <td>{user['requestedModel'] ? user['requestedModel'] : ''}</td>
                <td>{user['requestedAppVersion'] ? user['requestedAppVersion'] : ''}</td>
                <td>{user['createdAt'] ? timeStamp(user['createdAt']) : ''}</td>
            </tr>);
    });
    return (
        <Fragment>
            <div className="row">
                <div className="col-xl-12 col-lg-12">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-green">Users Device's List</h6>
                        </div>
                        <div className="row mt-2">
                        <div className="col-xl-4 col-lg-4">
                            <b className='ml-4'>User No.:{id}</b>
                        </div>
                        <div className="col-xl-4 col-lg-4">
                        <b>Name : {name}</b>
                        </div>
                        <div className="col-xl-4 col-lg-4">
                        <b>Contact : {contact}</b>
                        </div>

                        </div>
                        <div className="card-body">
                            <UsersDeviceDetailListByUserId usersDeviceDetails={usersDetails} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className="col-xl-12 col-lg-12">
                    <Paginate pageCount={pageCount} handlePageClick={handlePageClick} />
                </div>
            </div>
        </Fragment>
    )

}

export default UserDeviceListByUserId