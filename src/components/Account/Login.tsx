import React, { useState, FormEvent, Dispatch } from "react";
import { OnChangeModel } from "../../common/types/Form.types";
import { useDispatch } from "react-redux";
import { login } from "../../store/actions/account.actions";
import TextInput from "../../common/components/TextInput";
import { ToastContainer, toast } from 'react-toastify';
import Axios from 'axios'
import  { AxiosError } from 'axios';
import { useHistory } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;

const Login: React.FC = () => {
  const history = useHistory();
  const dispatch: Dispatch<any> = useDispatch();

  const [formState, setFormState] = useState({
    password: { error: "", value: "" },
    contact: { error: "", value: "" },
  });

  function sendLoginDispatch(user : string){
    dispatch(login(user));
  } 
  function hasFormValueChanged(model: OnChangeModel): void {
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }

  async function submit(e: FormEvent<HTMLFormElement>): Promise<void>  {
    e.preventDefault();
    if (isFormInvalid()) { return; }
    console.log("formstate", formState);
    let loginData: any = { ...formState };
    for (let i in loginData) {
      loginData[i] = loginData[i].value;
    }
    try {
      let login = await Axios.post(`${API_URL}/login`,loginData);
      console.log("login.data.data.user", login.data.data.user)
      if(login && login.data.status === 200){
        localStorage.setItem('token', login.data.data.token);
        localStorage.setItem('user', login.data.data.user ? login.data.data.user : 'admin');
        sendLoginDispatch(login.data.data.user ? login.data.data.user : 'admin')
        toast.success('Login successfully !!!', {
          position: toast.POSITION.TOP_RIGHT
      });
      history.push("/");

      } else {
        toast.error('Something Went Wrong !!!', {
          position: toast.POSITION.TOP_RIGHT
      });
      }
    } catch (error  ) {
      const err = error as AxiosError
      // console.log(err.response? err.response : '')
      toast.error(err.response? err.response.data.message : 'Something went wrong !!!', {
        position: toast.POSITION.TOP_RIGHT
    });
    }
  }

  function isFormInvalid() {
    return (formState.contact.error || formState.password.error
      || !formState.contact.value || !formState.password.value);
  }

  function getDisabledClass(): string {
    let isError: boolean = isFormInvalid() as boolean;
    return isError ? "disabled" : "";
  }

  return (

    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                <div className="col-lg-6">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-4">Welcome!</h1>
                    </div>
                    <form className="user" onSubmit={submit}>

                      <div className="form-group">

                        <TextInput id="input_contact"
                          field="contact"
                          value={formState.contact.value}
                          onChange={hasFormValueChanged}
                          required={true}
                          maxLength={100}
                          label="Contact"
                          placeholder="Contact" />
                      </div>
                      <div className="form-group">
                        <TextInput id="input_password"
                          field="password"
                          value={formState.password.value}
                          onChange={hasFormValueChanged}
                          required={true}
                          maxLength={100}
                          type="password"
                          label="Password"
                          placeholder="Password" />
                      </div>
                      <div className="form-group">
                        <div className="custom-control custom-checkbox small">
                          <input type="checkbox" className="custom-control-input" id="customCheck" />
                          <label className="custom-control-label"
                            htmlFor="customCheck">Remember Me</label>
                        </div>
                      </div>
                      <button
                        className={`btn btn-primary btn-user btn-block ${getDisabledClass()}`}
                        type="submit">
                        Login
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Login;
