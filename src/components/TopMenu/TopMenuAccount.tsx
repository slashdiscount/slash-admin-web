import React, { useState, Dispatch } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/actions/account.actions";
import { IStateType } from "../../store/models/root.interface";
import { useHistory } from "react-router-dom";
import slash_logo from '../../assets/slash_logo.jpeg';

function TopMenuAccount(): JSX.Element {
  const history = useHistory();
  const dispatch: Dispatch<any> = useDispatch();
  // console.log()
  const user = useSelector((state: IStateType) => state.account.user);
  const [isShow, setShow] = useState(false);

  function logOut(){
    if(localStorage.getItem('token')){
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(logout())
      history.push('/login')
    }
  }

  return (

    <li className="nav-item dropdown no-arrow">
      <a className="nav-link dropdown-toggle"
        onClick={() => {
          setShow(!isShow);
        }}
        href="# "
        id="userDropdown"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        <span className="mr-2 d-none d-lg-inline small cadet">{user}</span>
        <img className="img-profile rounded-circle" alt=""
          src={slash_logo} />
      </a>

      <div className={`dropdown-menu dropdown-menu-right shadow animated--grow-in ${(isShow) ? "show" : ""}`}
        aria-labelledby="userDropdown">
        <a className="dropdown-item"
        onClick={() => logOut()}
        href="# " 
        data-toggle="modal"
        data-target="#logoutModal">
          <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
          Logout
        </a>
      </div>
    </li>
  );
};

export default TopMenuAccount;
