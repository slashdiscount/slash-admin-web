import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import Axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import Popup from 'reactjs-popup';
const API_URL = process.env.REACT_APP_API_URL;

export type ButtonProps = {
  label?: string
  type?: string
  class?: string
  search?: () => void
}

export default function CommonButton(props: ButtonProps): JSX.Element {
  const [popup, setPopup] = useState(false);

  const config = {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  }
  const bulkIds: any = useSelector((state: any) => state.bulkCheckBox)
  console.log("bulkIds", bulkIds)
  async function buttonClik() {
      if (props.type === 'bulkDelete' || props.type === 'bulkHardDelete') {
        setPopup(true)
      } else if (props.type === 'commonSearch') {
        if (props.search) {
          props.search();
        }
      }
  }

  async function deleteTransaction() {
    try {
      if (props.type === 'bulkDelete') {
        let deleteTransactions = await Axios.put(`${API_URL}/${bulkIds.bulkDeleteApi}`, { id: bulkIds.bulkDeleteIds }, config);
        if (deleteTransactions.status === 200 && deleteTransactions.data.status === 200) {
          toast.success(deleteTransactions.data.message ? deleteTransactions.data.message : 'Transactions Deleted succesfully', {
            position: toast.POSITION.TOP_RIGHT
          });
        }

      }
      if (props.type === 'bulkHardDelete') {
        let deleteTransactions = await Axios.delete(`${API_URL}/${bulkIds.bulkHardDeleteApi}`, { headers: config.headers, data: { id: bulkIds.bulkDeleteIds } });
        if (deleteTransactions.status === 200 && deleteTransactions.data.status === 200) {
          toast.success(deleteTransactions.data.message ? deleteTransactions.data.message : 'Transactions Deleted succesfully', {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      }
      setPopup(false);
      bulkIds.renderPageFunction(bulkIds.page);
    } catch (error) {
      const err = error as AxiosError
      toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }
  return (
    <Fragment>
      <button className={`btn btn-${props.class ? props.class : 'primary'}`} onClick={() => { buttonClik() }}>{props.label ? props.label : ''}</button>
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
              onClick={() => deleteTransaction()}>Remove
            </button>
          </div>
        </div>
      </Popup>
    </Fragment>
  )
}
