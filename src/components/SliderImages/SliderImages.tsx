import Axios, { AxiosError } from 'axios';
// import { config } from '../../common/tokenConfig';
import React, { Dispatch, Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentPath } from '../../store/actions/root.actions';
import { toast } from 'react-toastify';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { logout } from '../../store/actions/account.actions';
import { Link, useHistory } from 'react-router-dom';
import { timeStamp } from '../../common/timeStamp';
import Popup from 'reactjs-popup';
import SliderImageList from './SliderImageList'
import CommonButton from '../../common/components/CommonButton';
const API_URL = process.env.REACT_APP_API_URL;

const SliderImage: React.FC = () => {
    const history = useHistory();
    const [sliderImages, setSliderImages] = useState([])
    const [popup, setPopup] = useState(false);
    const [deletId, setDeleteId] = useState(0);

    const dispatch: Dispatch<any> = useDispatch();
    dispatch(updateCurrentPath("Slider Images", "list"));

    let searchResults = useSelector((state: any) => state.searchResult);
    console.log("searchResults", searchResults);

    // console.log("config", config);

    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }
    const getSliderImages = async () => {
        try {
            // console.log("config", config)
            const sliderImages = await Axios.get(`${API_URL}/slider-images`, config);
            // console.log("sliderImages", sliderImages)
            if (sliderImages && sliderImages.data.status === 200) {
                setSliderImages(sliderImages.data.data)
            }
        } catch (error) {
            const err = error as AxiosError
            // console.log("err", err.response)
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
        getSliderImages();
    }, []);

    const confirmDelete = (id: number) => {
        setPopup(true);
        setDeleteId(id)
    }

    const deleteSliderImage = async (id: any) => {
        try {
            let deleteSliderImage = await Axios.delete(`${API_URL}/delete-slider-image?id=${id}`, config);
            // console.log("delete sliderImage", deleteSliderImage)
            if (deleteSliderImage.data.status === 200 && deleteSliderImage.statusText === "OK") {

                toast.success(deleteSliderImage.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
                getSliderImages();
            } else {
                toast.error('Something Went Wrong !!!', {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } catch (error) {
            const err = error as AxiosError
            // console.log("err", err.response)
            toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        setPopup(false);
    }

    let sliderImagesList = sliderImages.map((sliderImage, ind) => {

        return (
            <tr className={`table-row`} key={`sliderImage_${sliderImage['id']}`}>
                <th scope="row">{ind + 1}</th>
                <td>{sliderImage['sequence']}</td>
                <td><LazyLoadImage src={sliderImage['image']} alt="Slider Image" className="img-thumbnail" width={200} height={210} /></td>
                <td>{sliderImage['city'] ? sliderImage['city'] : ''}</td>
                <td>{timeStamp(sliderImage['createdAt'])}</td>
                <td>
                    <Link to={`/edit-slider-image/${sliderImage['id']}`}>
                        <button className="btn btn-primary ml-2 btn-sm" ><i className="fas fa-edit"></i></button>
                    </Link>
                    <button className="btn btn-danger ml-2 btn-sm" onClick={() => confirmDelete(sliderImage['id'])}><i className="fas fa-trash"></i></button>
                </td>
            </tr>
        )
    })

    return (
        <Fragment>
            <div className="row">
                <div className="col-sm col-lg-12 col-12 mb-2 text-right">
                    <Link to={`/create-slider-image`}>
                        <CommonButton label="Create Slider Image" class="success" />
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-12 col-lg-12">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-green">Slider Images List</h6>
                        </div>
                        <div className="card-body">
                            <SliderImageList sliderImages={sliderImagesList} />
                        </div>
                    </div>
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
                            onClick={() => deleteSliderImage(deletId)}>Remove
                        </button>
                    </div>
                </div>
            </Popup>
        </Fragment>
    )
}

export default SliderImage;

