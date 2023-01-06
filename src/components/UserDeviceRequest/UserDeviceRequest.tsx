import Axios, { AxiosError } from 'axios';
import React, { Dispatch, Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import CommonButton from '../../common/components/CommonButton';
import Paginate from '../../common/components/Paginate';
import ResetButton from '../../common/components/ResetButton';
import { logout } from '../../store/actions/account.actions';
import { commonSearch } from '../../store/actions/commonSearch.actions';
import { updateCurrentPath } from '../../store/actions/root.actions';
import UsersDeviceDetailList from "./UserDeviceRequestList"
import { timeStamp } from '../../common/timeStamp';
import Popup from 'reactjs-popup';

const API_URL = process.env.REACT_APP_API_URL;

const UserDeviceRequest: React.FC = () => {

    const [userDeviceDetails, setUserDeviceDetails] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [search, setSearch] = useState('')
    const [popup, setPopup] = useState(false);
    const [deletId, setDeleteId] = useState(0);


    const history = useHistory();
    const dispatch: Dispatch<any> = useDispatch();
    dispatch(updateCurrentPath("User Devices Request List", ""));

    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }
    let limit: number = 20;
    const getDeviceDetails = async () => {
        try {
            const deviceDetails = await Axios.get(`${API_URL}/users-device-details`, config);
            console.log("deviceDetails", deviceDetails);
            if (deviceDetails.status === 200 && deviceDetails.statusText === "OK") {
                setUserDeviceDetails(deviceDetails.data.deviceDetails.details);
                setpageCount(Math.ceil(deviceDetails.data.deviceDetails.size / limit))
                toast.success(deviceDetails.data.message ? deviceDetails.data.message : 'Fetched Successfully', {
                    position: toast.POSITION.TOP_RIGHT
                });
            }

        } catch (error) {
            const err = error as AxiosError
            // console.log(err.response? err.response : '')
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
        setSearch('')
        Object.keys(searchResults).forEach(k => delete searchResults[k]);
        getDeviceDetails();
    }, [])

    let searchResults = useSelector((state: any) => state.searchResult);
    console.log("searchResults", searchResults);

    useEffect(() => {
        if((searchResults !== null || searchResults !== undefined) && Object.keys(searchResults).length > 0){
            setUserDeviceDetails(searchResults && searchResults.deviceDetails.details.length > 0? searchResults.deviceDetails.details : []);
            setpageCount(Math.ceil(searchResults.deviceDetails.size[0].count / limit));
        }
     },[searchResults])
    
    const resetPage = () => {
        window.location.reload();
    }

    function searchUsers(): void {
        // console.log("search", search)
        if (search == '') {
            Object.keys(searchResults).forEach(k => delete searchResults[k]);
            getDeviceDetails()

        } else {

            dispatch(commonSearch(`${API_URL}/search-users-device-details?search=${search}`,{type : 'user'}));
            
        }
    }

    const fetchSkipUsers = async (page: number) => {
        try {
            if(search && search !== '' && searchResults && Object.keys(searchResults).length > 0){
                console.log("coming in fetchSkipUsers", search,page)
                let userDeviceDetails = await Axios.post(`${API_URL}/search-users-device-details?search=${search}&page=${page}`,{},config)
                console.log("userDeviceDetails: ", userDeviceDetails);
                return userDeviceDetails.data.deviceDetails.details;
            } else {

                let skippedUsers = await Axios.get(`${API_URL}/users-device-details?page=${page}`, config);
                return skippedUsers.data.deviceDetails.details
            }
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

    function handleClick(e : any){
        const { id, checked} = e.target;
        console.log(`${id} checked ${checked}`)
        setPopup(true);
        setDeleteId(id);
    }

    async function updateStatus(id : number){
        try {
            let updateStatus = await Axios.put(`${API_URL}/device-detail-update-status?id=${id}`,{}, config);
            console.log("update status", updateStatus)
            if(updateStatus.status === 200 && updateStatus.statusText === "OK"){
                toast.success(updateStatus.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            setPopup(false);
            getDeviceDetails();
        } catch (error){
            const err = error as AxiosError
            toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    let usersDetails;

    if(userDeviceDetails && userDeviceDetails.length < 1){
        usersDetails = <tr className={`table-row align-items-center`}><th className={`align-items-center`}>No Data Found</th></tr>
    } else {

        usersDetails = userDeviceDetails.map((user, ind) => {
            return (
                <tr className={`table-row`}
                    key={`user_${ind}`}>
                    <th scope="row">{ind + 1}</th>
                    <td>{user['userId'] ? user['userId'] : '' }</td>
                    <td>{user['name'] ? user['name'] : ''}</td>
                    <td>{user['contact'] ? user['contact'] : ''}</td>
                    <td>
                    <button className="btn btn-success" onClick = {handleClick} id = {user['id']} >Accept</button>
                    </td>
                    <td>{user['requestedModel'] ? user['requestedModel'] : ''}</td>
                    <td>{user['requestedAppVersion'] ? user['requestedAppVersion'] : ''}</td>
                    <td>{user['createdAt'] ? timeStamp(user['createdAt']) : ''}</td>
                    <td>
                    <Link to={`/device-details-by-userId?userId=${user['userId']}`}>
                            <button className="btn btn-primary ml-2 btn-sm" ><i className="fas fa-link"></i></button>
                        </Link>
                    </td>
                </tr>);
        });
    }
    return (
        <Fragment>
            <div className="row">
                <div className="col-sm col-lg-2 mb-2 col-sm-6 col-xs-6 col-6">
                    <input type="text" className="form-control " placeholder='Search here' onChange={(e) => { setSearch(e.target.value) }} value={search} />
                </div>
                <div className="col-sm col-lg-1 col-sm-3 col-xs-3 col-3">

                    <CommonButton label="Search" type="commonSearch" class="btn btn-success" search={searchUsers} />

                </div>
                <div className="col-sm col-lg-1 col-sm-3 col-xs-3 col-3">
                    <ResetButton refresh={resetPage} />
                </div>

            </div>
            <div className="row">
                <div className="col-xl-12 col-lg-12">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-green">Users Device's List</h6>
                        </div>
                        <div className="card-body">
                            <UsersDeviceDetailList usersDeviceDetails = {usersDetails}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className="col-xl-12 col-lg-12">
                    <Paginate pageCount={pageCount} handlePageClick={handlePageClick} />
                </div>
            </div>
            <Popup
                className="popup-modal"
                open={popup}
                onClose={() => setPopup(false)}
                closeOnDocumentClick
            >
                <div className="popup-modal">
                    <div className="popup-title">
                        Are you sure?
                    </div>
                    <div className="popup-content">
                        <button type="button"
                            className="btn btn-danger mr-2"
                            onClick={() => setPopup(false)}>Cancel
                        </button>
                        <button type="button"
                            className="btn btn-success"
                            onClick={() => updateStatus(deletId)}>Accept
                        </button>
                    </div>
                </div>
            </Popup>
        </Fragment>
    )
}

export default UserDeviceRequest