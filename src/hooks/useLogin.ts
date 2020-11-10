import { useHistory, useLocation } from "react-router-dom";

import useAuth from "../store/auth";
import { useCallback } from "react";

/**
 * Log a user in
 *
 * @param {Object} params Login parameters. May contain username/email, password, etc
 * @param {string} pathName The path to redirect to after login. By default, redirects to the home page
 *
 * @return {Function} any
 */

type Login = (params: any, pathName?: string) => any;

const useLogin = (): Login => {
  const { login } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const locationState = location.state as any;
  const nextPathName = locationState && locationState.nextPathname;

  const signIn = useCallback(
    async (params: any = {}, pathName = "/") => {
      try {
        let result = await login(params);
        history.push(nextPathName || pathName);
        return result;
      } catch (error) {
        throw error;
      }
    },
    [history, login, nextPathName]
  );

  return signIn;
};

export default useLogin;
