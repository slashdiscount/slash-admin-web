import Axios, { AxiosError } from 'axios';
import React, { Dispatch, FormEvent, Fragment, useState } from 'react'
import { config } from '../../common/tokenConfig';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import SelectInput from '../../common/components/Select';
import TextInput from '../../common/components/TextInput';
import { updateCurrentPath } from '../../store/actions/root.actions';
const API_URL = process.env.REACT_APP_API_URL;

export default function CreateFreeUser(): JSX.Element {
    const initialFormState: any = {
        name: { error: "", value: "" },
        contact: { error: "", value: "" },
        email: { error: "", value: "" },
        address: { error: "", value: "" },
        city: { error: "", value: "" },
        dob: { error: "", value: "" },
        gender: { error: "", value: "" },
        userType: { error: "", value: "Free" },
    };

    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    const [formState, setFormState] = useState(initialFormState);
    const history = useHistory();


    const dispatch: Dispatch<any> = useDispatch();
    dispatch(updateCurrentPath("Free User", "Create"));

    function hasFormValueChanged(model: any): void {
        setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
    }

    function isFormInvalid() {
        return (formState.contact.error || formState.name.error || formState.email.error || formState.address.error || formState.city.error
            || formState.dob.error || formState.gender.error || formState.userType.error || !formState.email.value || !formState.contact.value || !formState.name.value);
    }

    async function submitForm(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (isFormInvalid()) { return; }
        let submitFormDetails = { ...formState }
        for (let i in submitFormDetails) {
            if(submitFormDetails[i].value && submitFormDetails[i].value !== '' ){

                submitFormDetails[i] = submitFormDetails[i].value;
            }else {
                delete submitFormDetails[i];
            }
        }
        console.log("submitFormDetails", submitFormDetails)
        try {
            let createUser = await Axios.post(`${API_URL}/create-user`, submitFormDetails, config);
            console.log("createUser", createUser)
            if (createUser.data.status === 200 || createUser.status === 200 || createUser.data.status === 201 || createUser.status === 201) {
                toast.success(createUser.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            history.push("/free-users");
        } catch (error) {
            const err = error as AxiosError
            toast.error(err.response ? err.response.data.message && typeof(err.response.data.message) === 'object' ? err.response.data.message[0] : err.response.data.message : 'Something went wrong !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }
    return (
        <Fragment>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-green">Edit User</h6>
                </div>
                <div className="card-body">
                    <form onSubmit={submitForm}>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <TextInput id="input_user_type"
                                    value={'Member'}
                                    field=""
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    maxLength={50}
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
                                    maxLength={20}
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
                                    type="email"
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
                                    required={false}
                                    maxLength={20}
                                    label="City"
                                    placeholder="City" />
                            </div>
                            <div className="form-group col-md-6">
                                <TextInput id="input_address"
                                    value={formState.address.value}
                                    field="address"
                                    onChange={hasFormValueChanged}
                                    required={false}
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
                                    required={false}
                                    onChange={hasFormValueChanged}
                                    value={formState.gender.value}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <TextInput id="input_user_type"
                                    value={'Free'}
                                    field=""
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    maxLength={50}
                                    label="User Type"
                                    disabled={true}
                                    placeholder="User Type" />
                            </div>
                        </div>
                        <button type="submit" className={`btn btn-success`}>Create</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}
