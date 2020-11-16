import { BrowserRouter, Route, Switch } from "react-router-dom";

import BasicLayout from "../components/layout/Basic";
import DefaultLayout from "../components/layout/Default";
import Fixed from "../components/views/Fixed/Fixed";
import Home from "../components/views/Home/Home";
import Login from "../components/views/Login/Login";
import NotFound from "../components/views/Errors/NotFound";
import ProtectedRoute from "../router/ProtectedRoute";
import PublicRoute from "../router/PublicRoute";
import React from "react";
import RecoverPassword from "../components/views/RecoverPassword/RecoverPassword";
import Register from "../components/views/Register/Register";
import Variable from "../components/views/Variable/Variable";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute path="/" exact>
          <DefaultLayout>
            <Home />
          </DefaultLayout>
        </ProtectedRoute>
        <ProtectedRoute path="/variable">
          <DefaultLayout>
            <Variable />
          </DefaultLayout>
        </ProtectedRoute>
        <ProtectedRoute path="/fixed">
          <DefaultLayout>
            <Fixed />
          </DefaultLayout>
        </ProtectedRoute>
        <PublicRoute path="/login">
          <BasicLayout>
            <Login />
          </BasicLayout>
        </PublicRoute>
        <PublicRoute path="/register">
          <BasicLayout>
            <Register />
          </BasicLayout>
        </PublicRoute>
        <PublicRoute path="/forgot">
          <BasicLayout>
            <RecoverPassword />
          </BasicLayout>
        </PublicRoute>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
