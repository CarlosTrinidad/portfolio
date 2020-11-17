import { useCallback } from "react";
import { useFirestore } from "reactfire";
import useUser from "./useUser";

/**
 * Fixed rate investments functions
 *
 */

interface IFixed {
  name: string;
  rate: number;
  deadline: number;
  amount: number;
  startDate: any;
  expirationDate: any;
  assetClass: null | string;
  grossReturn: number;
}

export const useFixedActions = () => {
  const user = useUser();
  const firestore = useFirestore;

  const fixedRef = firestore().collection("fixed");

  const create = useCallback(
    (data: IFixed) => {
      return fixedRef.add({ ...data, userId: user.uid });
    },
    [user, fixedRef]
  );

  const get = useCallback(
    (uid: string) => {
      return fixedRef.where("userId", "==", uid).get();
    },
    [fixedRef]
  );

  const update = useCallback(
    (fixedId, data) => {
      return fixedRef.doc(fixedId).update(data);
    },
    [fixedRef]
  );

  const destroy = useCallback(
    (fixedId) => {
      return fixedRef.doc(fixedId).delete();
    },
    [fixedRef]
  );

  return {
    create,
    get,
    update,
    destroy,
  };
};
