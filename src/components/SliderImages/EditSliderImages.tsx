import React, { Dispatch, FormEvent, Fragment, useEffect, useState } from 'react'
import { config } from '../../common/tokenConfig';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'
import Axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { updateCurrentPath } from '../../store/actions/root.actions';
import TextInput from '../../common/components/TextInput';
import SelectInput from '../../common/components/Select';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import fs from "fs"
const API_URL = process.env.REACT_APP_API_URL;

export default function EditSliderImages(): JSX.Element {
    const { id }: any = useParams()
    const initialFormState: any = {
        file: { error: "", value: "" },
        sequence: { error: "", value: "" },
        city : { error: "",value : "" },
        image: ''
    };

    const [formState, setFormState] = useState(initialFormState);
    const history = useHistory();


    const dispatch: Dispatch<any> = useDispatch();
    dispatch(updateCurrentPath("Slider Images", "Edit"));

    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    const getSliderImageDetail = async () => {
        try {
            const response = await Axios.get(`${API_URL}/slider-image-byId?id=${id}`,config)
            if (response.status === 200) {
                console.log("response", response)
                setFormState({ ...formState,
                    file :{ error : '',value : response.data.data.sliderImageDetail.image ? response.data.data.sliderImageDetail.image : ''},
                    sequence:{ error : '',value : response.data.data.sliderImageDetail.sequence ? response.data.data.sliderImageDetail.sequence : ''},
                    city:{ error : '',value : response.data.data.sliderImageDetail.city ? response.data.data.sliderImageDetail.city : ''},
                    image : response.data.data.sliderImageDetail.image,
                    // image :{ error : '',value :  ? response.data.data.sliderImageDetail.image : ''}
                 });
            }
        } catch (error) {
            const err = error as AxiosError
            console.log("error", error)
            toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }
    useEffect(() => {
        getSliderImageDetail();
    }, [])

    function hasFormValueChanged(model: any): void {
        setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
    }

    function fileChange(e: any) {
        console.log("file name", e.target.files)
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
        formData.append('id', id)
        formData.append('file', formState.file.value)
        formData.append('sequence', formState.sequence.value)
        formData.append('city', formState.sequence.city)
        // console.log("submitFormDetails", formData)

        try {
            let updateSliderImage = await Axios.post(`${API_URL}/update-slider-image`, formData, config);
            console.log("updateSliderImage", updateSliderImage)
            if (updateSliderImage.data.status === 200 || updateSliderImage.status === 200 || updateSliderImage.data.status === 201 || updateSliderImage.status === 201) {
                toast.success(updateSliderImage.data.message, {
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
                        <button type="submit" className={`btn btn-success`}>Edit</button>
                        <button type="submit" className={`btn btn-danger ml-2`} onClick={() =>history.push("/slider-images") }>Back</button>

                    </form>
                </div>
            </div>
        </Fragment>
    )
}
