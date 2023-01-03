import React, { Dispatch, FormEvent, Fragment, useEffect, useState } from 'react'
import { config } from '../../common/tokenConfig';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'
import Axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { updateCurrentPath } from '../../store/actions/root.actions';
import TextInput from '../../common/components/TextInput';
import SelectInput from '../../common/components/Select';
const API_URL = process.env.REACT_APP_API_URL;

export default function EditUser(): JSX.Element {
    const { id }: any = useParams()
    console.log("id is", id)
    const initialFormState: any = {
        name: { error: "", value: "" },
        contact: { error: "", value: "" },
        email: { error: "", value: "" },
        address: { error: "", value: "" },
        city: { error: "", value: "" },
        dob: { error: "", value: "" },
        userType: { error: "", value: "" },
        gender: { error: "", value: "" },
    };
    const [formState, setFormState] = useState(initialFormState);

    const dispatch: Dispatch<any> = useDispatch();
    dispatch(updateCurrentPath("Users", "Edit"));

    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    const getUserDetail = async () => {
        try {
            let user = await Axios.get(`${API_URL}/user?id=${id}`, config);
            console.log("user is", user)
            if (user.status === 200 && user.statusText === "OK") {
                let dob = user.data.data.userDetail.dob && user.data.data.userDetail.dob.split('-')[0].length === 2 ? moment(moment(user.data.data.userDetail.dob, 'DD-MM-YYYY')).format('YYYY-MM-DD') : user.data.data.userDetail.dob;
                setFormState({
                    name: { error: "", value: user.data.data.userDetail.name ? user.data.data.userDetail.name : '' },
                    contact: { error: "", value: user.data.data.userDetail.contact ? user.data.data.userDetail.contact : '' },
                    email: { error: "", value: user.data.data.userDetail.email ? user.data.data.userDetail.email : '' },
                    address: { error: "", value: user.data.data.userDetail.address ? user.data.data.userDetail.address : '' },
                    city: { error: "", value: user.data.data.userDetail.city ? user.data.data.userDetail.city : '' },
                    dob: { error: "", value: dob ? dob : '' },
                    userType: { error: "", value: user.data.data.userDetail.userId.typeId.type ? user.data.data.userDetail.userId.typeId.type : '' },
                    gender: { error: "", value: user.data.data.userDetail.gender ? user.data.data.userDetail.gender : '' },
                })
            }
        } catch (error) {
            const err = error as AxiosError
            toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }
    useEffect(() => {
        getUserDetail();
    }, [])

    function hasFormValueChanged(model: any): void {
        setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
    }

    function isFormInvalid() {
        return (formState.contact.error || formState.name.error || formState.email.error || formState.address.error || formState.city.error
            || formState.dob.error || formState.gender.error || !formState.email.value || !formState.contact.value || !formState.name.value);
    }
    async function editForm(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (isFormInvalid()) { return; }
        let editFormDetails = { ...formState }
        for (let i in editFormDetails) {
            editFormDetails[i] = editFormDetails[i].value;
        }
        delete editFormDetails['userType'];
        editFormDetails['id'] = parseInt(id);
        // console.log("editFormDetails", editFormDetails)
        try {
            let updateUser = await Axios.put(`${API_URL}/update-user`, editFormDetails, config)
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
        getUserDetail();
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
                                <TextInput id="input_user_type"
                                    value={formState.userType.value}
                                    field="userType"
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    maxLength={20}
                                    label="User Type"
                                    disabled={true}
                                    placeholder="User Type" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <TextInput id="input_name"
                                    value={formState.name.value}
                                    field="name"
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    maxLength={50}
                                    label="Name"
                                    placeholder="Name" />
                            </div>
                            <div className="form-group col-md-6">
                            <TextInput id="input_contact"
                                    type='number'
                                    value={formState.contact.value}
                                    field="contact"
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    maxLength={10}
                                    minLength={10}
                                    label="Contact"
                                    placeholder="Contact" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <TextInput id="input_email"
                                    value={formState.email.value}
                                    field="email"
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    maxLength={50}
                                    label="email"
                                    placeholder="email" />
                            </div>
                            <div className="form-group col-md-6">
                                <TextInput id="input_dob"
                                    type="date"
                                    value={formState.dob.value}
                                    field="dob"
                                    onChange={hasFormValueChanged}
                                    required={false}
                                    maxLength={20}
                                    label="Date Of Birth"
                                    placeholder="Date of Birth"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <TextInput id="input_city"
                                    value={formState.city.value}
                                    field="city"
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    maxLength={20}
                                    label="City"
                                    placeholder="City" />
                            </div>
                            <div className="form-group col-md-6">
                                <TextInput id="input_address"
                                    value={formState.address.value}
                                    field="address"
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    maxLength={50}
                                    label="Address"
                                    placeholder="Address" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <SelectInput
                                    id="input_gender"
                                    field="gender"
                                    label="Gender"
                                    options={["Male", "Female"]}
                                    required={true}
                                    onChange={hasFormValueChanged}
                                    value={formState.gender.value}
                                />
                            </div>
                        </div>
                        <button type="submit" className={`btn btn-success`}>Edit</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}
