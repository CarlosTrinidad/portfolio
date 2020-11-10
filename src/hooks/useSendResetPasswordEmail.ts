import { useAuth } from "reactfire";
import { useCallback } from "react";

/**
 * Send a recovery password email if the email is already registered
 *
 * @param {Object} email Recover email
 *
 * @return {Function} any
 */

type ISendRecover = (email: string) => any;

const useSendPasswordEmail = (): ISendRecover => {
  const auth = useAuth();

  const send = useCallback(
    (email: string) => {
      return auth.sendPasswordResetEmail(email, {
        url: process.env.REACT_APP_LOGIN_URL_REDIRECT || "",
      });
    },
    [auth]
  );

  return send;
};

export default useSendPasswordEmail;
