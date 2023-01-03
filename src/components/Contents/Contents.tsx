import Axios, { AxiosError } from 'axios';
import React, { Dispatch, Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../../store/actions/account.actions';
import { updateCurrentPath } from '../../store/actions/root.actions';
import ContentsList from './ContentsList';
const API_URL = process.env.REACT_APP_API_URL;

export default function Contents(): JSX.Element {
    const [contents, setContents] = useState([]);
    const history = useHistory();
    const dispatch: Dispatch<any> = useDispatch();
    dispatch(updateCurrentPath("Contents", ""));

    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    const getContents = async () => {
        try {
            const contents = await Axios.get(`${API_URL}/get-contents`, config);
            console.log("contents", contents);
            if (contents.status === 200 && contents.statusText === "OK") {
                setContents(contents.data.data)
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
        getContents();
    }, [])

    let contentDetails = contents.map((content, ind) => {
        return (
            <tr className={`table-row`}
                key={`content_${content['id']}`}>
                <th scope="row">{ind + 1}</th>
                <th scope="row">{content['aboutUs']}</th>
                <th scope="row">{content['terms']}</th>
                <th scope="row">{content['policy']}</th>
                <th scope="row">{content['faq']}</th>
                <th scope="row">
                    <Link to={`edit-content`}>
                        <button className="btn btn-primary ml-2 btn-sm" ><i className="fas fa-edit"></i></button>
                    </Link>
                </th>

            </tr>);
    });

    return (
        <Fragment>
            <div className="row">
                <div className="col-xl-12 col-lg-12">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-green">Contents List</h6>
                        </div>
                        <div className="card-body">
                            <ContentsList content={contentDetails} />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
