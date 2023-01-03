import Axios, { AxiosError } from 'axios';
import React, { Dispatch, FormEvent, Fragment, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import TextInput from '../../common/components/TextInput';
import { updateCurrentPath } from '../../store/actions/root.actions';
const API_URL = process.env.REACT_APP_API_URL;

export default function CreateUser(): JSX.Element {
    const initialFormState: any = {
        file: { error: "", value: "" },
        sequence: { error: "", value: "" },
        city : { error: "",value : "" },
        image: ''
    };

    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    const [formState, setFormState] = useState(initialFormState);
    const history = useHistory();


    const dispatch: Dispatch<any> = useDispatch();
    dispatch(updateCurrentPath("Slider Image", "Create"));

    function hasFormValueChanged(model: any): void {
        setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
    }

    function fileChange(e: any) {
        // console.log("file name", e.target.files)
        if (e.target.files && e.target.files[0]) {
            if(e.target.files[0].name.includes("png") || e.target.files[0].name.includes("jpg") || e.target.files[0].name.includes("jpeg")) {
                setFormState({ ...formState, file: { error: '', value: e.target.files[0] }, image: URL.createObjectURL(e.target.files[0]) });
            } else {
                setFormState({ ...formState, file: { error: 'Invalid image format', value: '' }, image : '' });

            }
        }

    }

    function isFormInvalid() {
        return (formState.sequence.error || !formState.sequence.value || formState.file.error);
    }

    async function submitForm(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (isFormInvalid()) { 
            // console.log("formState", formState)
            if(formState.file.error){
                toast.error(formState.file.error,{
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            return;
         }
        const formData = new FormData()
        formData.append('file', formState.file.value)
        formData.append('sequence', formState.sequence.value)
        formData.append('city', formState.sequence.city)
        // console.log("submitFormDetails", formData)

        try {
            let createSliderImage = await Axios.post(`${API_URL}/create-slider-image`, formData, config);
            // console.log("createSliderImage", createSliderImage)
            if (createSliderImage.data.status === 200 || createSliderImage.status === 200 || createSliderImage.data.status === 201 || createSliderImage.status === 201) {
                toast.success(createSliderImage.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            history.push("/slider-images");
        } catch (error) {
            const err = error as AxiosError
            toast.error(err.response ? err.response.data.message && typeof (err.response.data.message) === 'object' ? err.response.data.message[0] : err.response.data.message : 'Something went wrong !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }
    return (
        <Fragment>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-green">Create Slider Image</h6>
                </div>
                <div className="card-body">
                    <form onSubmit={submitForm}>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Select Image</label>
                                <input id="input_file"
                                    className={`form-control`}
                                    type="file"
                                    onChange={fileChange}
                                    required={true}
                                    maxLength={200}
                                    placeholder="file" />
                                {formState.file.error ?
                                    <div className="invalid-feedback">
                                        {formState.file.error}
                                    </div> : null
                                }
                                {formState.image && formState.image !== '' ? <LazyLoadImage className = "mt-2"src={formState.image} alt="preview image" width = {200} height = {200} /> : ''}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <TextInput id="input_sequence"
                                    type='number'
                                    value={formState.sequence.value}
                                    field="sequence"
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    maxLength={10}
                                    minLength={1}
                                    label="Sequence"
                                    placeholder="sequence" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <TextInput id="input_city"
                                    type='text'
                                    value={formState.city.value}
                                    field="city"
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    maxLength={10}
                                    minLength={1}
                                    label="city"
                                    placeholder="city" />
                            </div>
                        </div>
                        <button type="submit" className={`btn btn-success`}>Create</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}
