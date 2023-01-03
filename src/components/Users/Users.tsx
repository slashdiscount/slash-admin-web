import Axios, { AxiosError } from 'axios';
// import { config } from '../../common/tokenConfig';
import React, { Dispatch, Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentPath } from '../../store/actions/root.actions';
import { toast } from 'react-toastify';
import { logout } from '../../store/actions/account.actions';
import { Link, useHistory } from 'react-router-dom';
import UsersList from './UsersList';
import Paginate from '../../common/components/Paginate';
import { timeStamp } from '../../common/timeStamp';
import Popup from 'reactjs-popup';
import CommonButton from '../../common/components/CommonButton';
import ResetButton from '../../common/components/ResetButton';
import { commonSearch } from "../../store/actions/commonSearch.actions"
import {ExportToExcel} from '../../common/components/ExportToExcel'
const API_URL = process.env.REACT_APP_API_URL;

const Users: React.FC = () => {
    const history = useHistory();
    const [users, setUsers] = useState([])
    const [pageCount, setpageCount] = useState(0);
    const [popup, setPopup] = useState(false);
    const [deletId, setDeleteId] = useState(0);
    const [deleteUrl, setDeleteUrl] = useState('')
    const [search, setSearch] = useState('')
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const dispatch: Dispatch<any> = useDispatch();
    dispatch(updateCurrentPath("Users", "list"));

    let searchResults = useSelector((state: any) => state.searchResult);
    console.log("searchResults", searchResults);

    let limit: number = 20;
    // console.log("config", config);

    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }
    const getUsers = async () => {
        try {
            console.log("config",config)
            searchResults = {};
            const users = await Axios.get(`${API_URL}/get-users`, config);
            console.log("users", users)
            if (users && users.data.status === 200) {
                setUsers(users.data.data.users)
                setpageCount(Math.ceil(users.data.data.count / limit));
            }
        } catch (error) {
            const err = error as AxiosError
            console.log("err", err.response)
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
    };

    useEffect(() => {
        console.log("coming in use effect...");
        setSearch('')
        Object.keys(searchResults).forEach(k => delete searchResults[k]);
        getUsers();
    }, []);

    const fetchSkipUsers = async (page: number) => {
        try {
            if(search && search !== '' && searchResults && Object.keys(searchResults).length > 0){
                console.log("coming in fetchSkipUsers", search,page)
                let users = await Axios.post(`${API_URL}/search-user?search=${search}&page=${page}`,{},config)
                console.log("users: ", users);
                return users.data.data.users;
            } else {

                let skippedUsers = await Axios.get(`${API_URL}/get-users?page=${page}`, config);
                return skippedUsers.data.data.users
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
        setUsers(users);

    };

    const confirmDelete = (id: number, url: string) => {
        setPopup(true);
        setDeleteId(id)
        setDeleteUrl(url)
    }

    const deleteUser = async (id: any) => {
        try {
            let deleteUser = null;
            if (deleteUrl === 'update-status') {

                deleteUser = await Axios.put(`${API_URL}/${deleteUrl}?id=${id}`, {}, config);
            } else {
                deleteUser = await Axios.delete(`${API_URL}/${deleteUrl}?id=${id}`, config);

            }
            console.log("delete user", deleteUser)
            if (deleteUser.data.status === 200 && deleteUser.statusText === "OK") {

                toast.success(deleteUser.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
                getUsers();
            } else {
                toast.error('Something Went Wrong !!!', {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } catch (error) {
            const err = error as AxiosError
            console.log("err", err.response)
            toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        setPopup(false);
    }

    function searchUsers(): void {
        // console.log("search", search)
        if (search == '') {
            Object.keys(searchResults).forEach(k => delete searchResults[k]);
            getUsers()

        } else {

            dispatch(commonSearch(`${API_URL}/search-user?search=${search}`,{type : 'user'}));
            
        }
    }

    useEffect(() => {
        if((searchResults !== null || searchResults !== undefined) && Object.keys(searchResults).length > 0){

            setUsers(searchResults && searchResults.data.users.length > 0? searchResults.data.users : users);
            setpageCount(Math.ceil(searchResults.data.size / limit));
        }
     },[searchResults])

     const resetPage = () => {
        setSearch('')
        Object.keys(searchResults).forEach(k => delete searchResults[k]);
        getUsers()
    }

    let usersDetails;

    if(users && users.length < 0){
        usersDetails = <tr className={`table-row align-items-center`}><th className={`align-items-center`}>No Data Found</th></tr>
    } else {

        usersDetails = users.map((user, ind) => {
            return (
                <tr className={`table-row`}
                    key={`user_${user['id']}`}>
                    <th scope="row">{ind + 1}</th>
                    <td>{user['id']}<Link to={`/transactions?userId=${user['id']}`}><i className="fa fa-list" aria-hidden="true" style={{"fontSize" :"15px","float" : "right","marginTop" : "5px"}}></i></Link></td>
                    <td>{user['wallet'] && user['wallet'] !== null ? user['wallet'] : 0}</td>
                    <td>{user['name']}<Link to={`/user-refferals/${user['id']}`}><i className="fa fa-link" aria-hidden="true" style={{"fontSize" :"15px","float" : "right","marginTop" : "5px"}}></i></Link></td>
                    <td>{user['contact']}<Link to={`/user-rewards/${user['id']}`}><i className="fa fa-list" aria-hidden="true" style={{"fontSize" :"15px","float" : "right","marginTop" : "5px"}}></i></Link></td>
                    <td>{user['email']}</td>
                    <td>{user['type']}</td>
                    <td>{user['address']}</td>
                    <td>{timeStamp(user['createdAt'])}</td>
                    <td>{user['refferedby'] && user['refferedby'] !== null ? user['refferedby'] : ''}</td>
                    <td>
                        <Link to={`/edit-user/${user['id']}`}>
                            <button className="btn btn-primary ml-2 btn-sm" ><i className="fas fa-edit"></i></button>
                        </Link>
                        <button className="btn btn-success ml-2 btn-sm" onClick={() => confirmDelete(user['id'], 'update-status')}><i className="fas fa-trash"></i></button>
                        <button className="btn btn-danger ml-2 btn-sm" onClick={() => confirmDelete(user['id'], 'user-delete')}><i className="fas fa-trash"></i></button>
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

                    <CommonButton label="Search" type="commonSearch" class="primary" search={searchUsers}/>

                </div>
                <div className="col-sm col-lg-1 col-sm-3 col-xs-3 col-3">
                    <ResetButton refresh = {resetPage}/>
                </div>
                <div className="col-sm col-lg-2 col-6">
                    <div className="form-group" >
                        <input
                            className="form-control"
                            type="date"
                            name="duedate"
                            placeholder="Due date"
                            onChange={(e: any) => setStartDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-sm col-lg-2 col-6">
                    <div className="form-group" >
                        <input
                            className="form-control"
                            type="date"
                            name="duedate"
                            placeholder="Due date"
                            onChange={(e: any) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-sm col-lg-2 col-3">
                    <ExportToExcel startDate = {startDate} endDate = {endDate} api = {'search-users-by-date'} type = {'users'} />

                </div>
                <div className="col-sm col-lg-2 col-5">
                    <Link to={`/create-user`}>

                        <CommonButton label="Create User" class="success" />
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-12 col-lg-12">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-green">Users List</h6>
                        </div>
                        <div className="card-body">
                            <UsersList users={usersDetails} />
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
                            className="btn btn-success mr-2"
                            onClick={() => setPopup(false)}>Cancel
                        </button>
                        <button type="button"
                            className="btn btn-danger"
                            onClick={() => deleteUser(deletId)}>Remove
                        </button>
                    </div>
                </div>
            </Popup>
        </Fragment>
    )
}

export default Users;

