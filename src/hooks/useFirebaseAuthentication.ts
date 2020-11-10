import { useEffect, useState } from "react";

import { useUser } from "reactfire";

/**
 * Get the auth state of the user
 *
 * @return {Function} any
 */

type IAuth = null | boolean;
const useFirebaseAuthentication = () => {
  const [isAuth, setIsAuth] = useState<IAuth>(null);
  const user = useUser();

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (user) {
        // TODO: Add important data to localStorage/Cookies
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  return isAuth;
};

export default useFirebaseAuthentication;
