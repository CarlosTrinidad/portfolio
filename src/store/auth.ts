import { auth } from "./../utils/firebase";
import create from "zustand";

type Credentials = {
  email: string;
  password: string;
}
type Error = {
  status: Number;
}

const useAuth = create((set) => {
  return {
    authenticated: false,
    setAuthenticated: () => set(() => ({ authenticated: true })),
    setUnauthenticated: () => set(() => ({ authenticated: false })),
    login: ({ email, password }: Credentials) => {
      return auth().signInWithEmailAndPassword(email, password);
    },
    logout: () => {
      return auth().signOut();
    },
    checkError: (error: Error) => {
      const status = error.status;
      if (status === 401 || status === 403) {
        // Redirect to 401 or 403 page
      }
    },
    getPermissions: () => {
      //   return permissions
    },
    register: ({ email, password }: Credentials) => {
      return auth().createUserWithEmailAndPassword(email, password);
    },
  };
});

export default useAuth;
