import { useCallback } from "react";
import { useFirestore } from "reactfire";
import useUser from "./useUser";

/**
 * EmergencyFund functions
 *
 */

interface IEmergencyFund {
  name: string;
  rate: number;
  deadline: number;
  amount: number;
  startDate: any;
  expirationDate: any;
  grossReturn: number;
}

export const useEmergencyFundActions = () => {
  const user = useUser();
  const firestore = useFirestore;

  const emergencyFundRef = firestore().collection("emergencyFund");

  const create = useCallback(
    (data: IEmergencyFund) => {
      return emergencyFundRef.add({ ...data, userId: user.uid });
    },
    [user, emergencyFundRef]
  );

  const get = useCallback(
    (uid: string) => {
      return emergencyFundRef.where("userId", "==", uid).get();
    },
    [emergencyFundRef]
  );

  const update = useCallback(
    (emergencyFundId, data) => {
      return emergencyFundRef.doc(emergencyFundId).update(data);
    },
    [emergencyFundRef]
  );

  const destroy = useCallback(
    (emergencyFundId) => {
      return emergencyFundRef.doc(emergencyFundId).delete();
    },
    [emergencyFundRef]
  );

  return {
    create,
    get,
    update,
    destroy,
  };
};
