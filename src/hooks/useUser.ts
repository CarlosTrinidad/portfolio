import { useEffect, useState } from "react";

import { useAuth } from "reactfire";

/**
 * Get the auth state of the user
 *
 * @return {Function} any
 */

type IUser = any;

const useUser = (): IUser => {
  const [user, setUser] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    const unlisten = auth.onAuthStateChanged((usr: any) => {
      if (usr) {
        setUser(usr);
      } else {
        setUser(null);
      }
    });
    return () => {
      unlisten();
    };
  }, [auth]);

  return user;
};

export default useUser;
