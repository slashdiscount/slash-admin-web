import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react'
import Popup from 'reactjs-popup';
import {  toast } from 'react-toastify';

export type confirmBoxProps = {
    deleteId?: number
    deleteUrl?: string
    popup?: boolean
};

export default function ConfirmBox(props: confirmBoxProps): JSX.Element {
    console.log("Confirm box", props);
    const [pop, setPopup] = useState(props.popup ? true : false);
    console.log("pop",pop)

    //delete product
    const deleteProduct = async () => {
        // console.log("id", id)
        const deleteProduct = await Axios.delete(`${props.deleteUrl}/${props.deleteId}`);
        console.log("deleteProduct", deleteProduct);
        if (deleteProduct.status === 200 && deleteProduct.statusText === "OK") {

            toast.success('Deleted Succesfully !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            toast.error('Something Went Wrong !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        setPopup(false);
    }
    return (
        <Fragment>
            <Popup
                className="popup-modal"
                open={pop}
                onClose={() => {setPopup(false)}}
                closeOnDocumentClick
            >
                <div className="popup-modal">
                    <div className="popup-title">
                        Are you sure?
                    </div>
                    <div className="popup-content">
                        <button type="button"
                            className="btn btn-danger"
                            onClick={() => deleteProduct()}>Remove
                        </button>
                    </div>
                </div>
            </Popup>
        </Fragment>
    )
}
