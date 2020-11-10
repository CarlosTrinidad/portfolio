import useAuth from "../store/auth";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";

/**
 * Log out user
 *
 * @param {string} redirectTo The path to redirect to after logout. By default, redirects to the home page.
 *
 * @return {Function} any
 */

type ILogout = (logoutOnFailure?: boolean, redirectTo?: string) => any;

const useLogout = (): ILogout => {
  const { logout } = useAuth();
  const history = useHistory();

  const signOut = useCallback(
    (redirectTo = "/login") =>
      logout().then(() => {
        history.push({
          pathname: redirectTo,
          state: {
            nextPathname: history.location && history.location.pathname,
          },
        });
        return true;
      }),
    [history, logout]
  );

  return signOut;
};
export default useLogout;
