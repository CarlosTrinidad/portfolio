import { useCallback } from "react";
import useFirebaseAuthentication from "./useFirebaseAuthentication";
import useLogout from "./useLogout";

/**
 * Check auth state. In case of error proceeds to do a logout and a redirect to login
 *
 * @param {boolean} logoutOnFailure if true, a logout is executed when error
 * @param {string} redirectTo The path to redirect to after logout. By default, redirects to the home page.
 *
 * @return {null | boolean} any
 */


type ICheckOut = (
  logoutOnFailure?: boolean,
  redirectTo?: string
) => null | boolean;

const useCheckAuth = (): ICheckOut => {
  const isAuth = useFirebaseAuthentication();
  const logout = useLogout();
  const check = useCallback(
    (logoutOnFailure = true, redirectTo = "/login") => {
      if (logoutOnFailure && isAuth === false) {
        logout(redirectTo);
      }

      return isAuth;
    },
    [isAuth, logout]
  );

  return check;
};

export default useCheckAuth;
