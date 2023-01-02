import React, { Fragment } from "react";
import LeftMenu from "../LeftMenu/LeftMenu";
import TopMenu from "../TopMenu/TopMenu";
import { Switch, Route } from "react-router";
import DashBoard from "../DashBoard/DashBoard";
import Notifications from "../../common/components/Notification";
import Users from '../Users/Users'
import CreateUser from "../Users/CreateUser";
import EditUser from "../Users/EditUser";
import UserRewards from "../Users/Rewards/UserRewards";
import Transactions from "../Transactions/Transactions";
import UserRefferals from "../Users/Refferals/UserRefferals";
import FreeUsers from '../FreeUsers/FreeUsers'
import CreateFreeUser from "../FreeUsers/CreateFreeUser";


const Admin: React.FC = () => {

  return (
    <Fragment>
      <Notifications />
      <LeftMenu />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopMenu />
          <div className="container-fluid">
            <Switch>
              <Route path={`/users`}><Users /></Route>
              <Route path={`/create-user`}><CreateUser /></Route>
              <Route path={`/edit-user/:id`}><EditUser /></Route>
              <Route path={`/user-rewards/:id`}><UserRewards /></Route>
              <Route path={`/transactions`}><Transactions /></Route>
              <Route path={`/user-refferals/:id`}><UserRefferals /></Route>
              <Route path={`/free-users`}><FreeUsers /></Route>
              <Route path={`/create-free-user`}><CreateFreeUser /></Route>
              <Route path="/"><DashBoard /></Route>
            </Switch>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;
