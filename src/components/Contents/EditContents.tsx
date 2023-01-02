import Axios, { AxiosError } from 'axios';
import React, { Dispatch, FormEvent, Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import SelectInput from '../../common/components/Select';
import TextInput from '../../common/components/TextInput';
import { logout } from '../../store/actions/account.actions';
import { updateCurrentPath } from '../../store/actions/root.actions';
const API_URL = process.env.REACT_APP_API_URL;

export default function EditContents(): JSX.Element {
    const [contents, setContents] = useState([]);
    const history = useHistory();
    const initialFormState: any = {
        aboutUs: { error: "", value: "" },
        faq: { error: "", value: "" },
        policy: { error: "", value: "" },
        terms: { error: "", value: "" },
        id: { error: "", value: 1 },

    };
    const [formState, setFormState] = useState(initialFormState);

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
                setFormState({
                    ...formState,
                    aboutUs: { error: "", value: contents.data.data[0].aboutUs ? contents.data.data[0].aboutUs : '' },
                    faq: { error: "", value: contents.data.data[0].faq ? contents.data.data[0].faq : '' },
                    policy: { error: "", value: contents.data.data[0].policy ? contents.data.data[0].policy : '' },
                    terms: { error: "", value: contents.data.data[0].terms ? contents.data.data[0].terms : '' },
                    id: { error: "", value: contents.data.data[0].id ? parseInt(contents.data.data[0].id) : '' },
                })
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

    function hasFormValueChanged(e: any): void {
        setFormState({ ...formState, [e.target.id]: { error: '', value: e.target.value } });
    }

    function isFormInvalid() {
        return (formState.aboutUs.error || formState.faq.error || formState.terms.error || formState.policy.error
            || !formState.terms.value || !formState.aboutUs.value || !formState.faq.value || !formState.policy.value);
    }
    async function editForm(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (isFormInvalid()) { return; }
        let editFormDetails = { ...formState }
        for (let i in editFormDetails) {
            editFormDetails[i] = editFormDetails[i].value;
        }
        // console.log("editFormDetails", editFormDetails)
        try {
            let updateUser = await Axios.put(`${API_URL}/update-content`, editFormDetails, config)
            console.log("updateUser", updateUser);
            if (updateUser.data.status === 200 && updateUser.status === 200) {
                toast.success(updateUser.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } catch (error) {
            const err = error as AxiosError
            toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        getContents();
    }
    return (
        <Fragment>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-green">Edit User</h6>
                </div>
                <div className="card-body">
                    <form onSubmit={editForm}>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor='About Us'>{'About Us'}</label>
                                <textarea id="aboutUs"
                                    className='form-control content-text-area'
                                    value={formState.aboutUs.value}
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    placeholder="About us" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="Faq's">{"Faq's"}</label>
                                <textarea id="faq"
                                    className='form-control content-text-area'
                                    value={formState.faq.value}
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    placeholder="faq" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="Terms">{"Terms"}</label>
                                <textarea id="terms"
                                    className='form-control content-text-area'
                                    value={formState.terms.value}
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    placeholder="terms" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="Policy">{"Policy"}</label>
                                <textarea id="policy"
                                    className='form-control content-text-area'
                                    value={formState.policy.value}
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    placeholder="policy" />
                            </div>
                        </div>
                        <button type="submit" className={`btn btn-success`}>Edit</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}
