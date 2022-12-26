import Axios, { AxiosError } from "axios";
import React, { Fragment, Dispatch, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import TopCard from "../../common/components/TopCard";
import { logout } from "../../store/actions/account.actions";
import { updateCurrentPath } from "../../store/actions/root.actions";
const API_URL = process.env.REACT_APP_API_URL;

const DashBoard: React.FC = () => {
  const history = useHistory();

  const [dashBoardData,setDashBoardData] = useState({
    orderCount : 0,
    sliderImageCount : 0,
    topVendorsCount : 0,
    transactionsCount : 0,
    userCount : 0
  })
  const dispatch: Dispatch<any> = useDispatch();
  dispatch(updateCurrentPath("DashBoard", ""));

  const config = {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  }

  const getDashBoard = async () => {
    try {
      const dashBoard = await Axios.get(`${API_URL}/dashboard/dashboard-count-list`, config);
      console.log("dashboard", dashBoard);
      if(dashBoard && dashBoard.status === 200 && dashBoard.statusText === "OK"){
        setDashBoardData({...dashBoardData,...dashBoard.data})
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
    getDashBoard();
  },[])
  return (
    <Fragment>
      <h1 className="h3 mb-2 text-gray-800">Dashboard</h1>
      <p className="mb-4">Summary and overview of our admin stuff here</p>

      <div className="row">
        <TopCard title="ORDER COUNT" text={`${dashBoardData.orderCount.toString()}`} icon="box" class="primary" />
        <TopCard title="SLIDER IMAGE COUNT" text={`${dashBoardData.sliderImageCount.toString()}`} icon="warehouse" class="danger" />
        <TopCard title="TOP VENDOR COUNT" text={`${dashBoardData.topVendorsCount.toString()}`} icon="dollar-sign" class="success" />
      </div>

      <div className="row">
        <TopCard title="TRANSACTIONS COUNT" text={`${dashBoardData.transactionsCount.toString()}`} icon="donate" class="primary" />
        <TopCard title="USER COUNT" text={`${dashBoardData.userCount.toString()}`} icon="calculator" class="danger" />
      </div>

    </Fragment>
  );
};

export default DashBoard;
