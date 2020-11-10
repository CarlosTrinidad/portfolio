import useAuth from "../store/auth";
import { useCallback } from "react";

/**
 * Creates a user
 *
 * @param {Object} params Create user parameters. May contain username/email, password, etc
 * @param {string} pathName The path to redirect to after register. By default, redirects to the home page
 *
 * @return {Function} any
 */

type Credentials = (params: any, pathName?: string) => any;

const useRegister = (): Credentials => {
  const { register } = useAuth();
  const createUserWithEmailAndPassword = useCallback(
    (params: any = {}, pathName) => {
      return register(params);
    },
    [register]
  );

  return createUserWithEmailAndPassword;
};

export default useRegister;
