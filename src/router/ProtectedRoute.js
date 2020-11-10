import React, { useEffect, useState } from "react";
import { Route, useHistory } from "react-router-dom";

import Loader from "../components/common/Loader/Loader";
import useCheckAuth from "../hooks/useCheckAuth";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const checkAuth = useCheckAuth();
  const history = useHistory();

  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    let mounted = true;
    let result = checkAuth();
    if (mounted) {
      setIsAuth(result);
      if (result === false) {
        history.push("/login");
      }
    }

    return () => {
      mounted = false;
    };
  }, [checkAuth, history]);

  if (isAuth === true) {
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
