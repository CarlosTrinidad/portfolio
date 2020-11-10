import React, { useEffect, useState } from "react";

import Loader from "../components/common/Loader/Loader";
import { Route } from "react-router-dom";
import useCheckAuth from "../hooks/useCheckAuth";
import { useHistory } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const checkAuth = useCheckAuth();
  const history = useHistory();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    let mounted = true;
    let result = checkAuth(false);

    if (mounted) {
      setIsAuth(result);
      if (result === true) {
        history.push("/");
      }
    }
    return () => {
      mounted = false;
    };
  }, [checkAuth, history]);

  if (isAuth === false) {
    return (
      <Route
        {...rest}
        component={Component}
      />
    );
  }

  return <Loader />;
};

export default PrivateRoute;
