import { useCallback } from "react";
import { useFirestore } from "reactfire";
import useUser from "./useUser";

/**
 * Variable functions
 *
 */

interface IVariable {
  symbol: string;
  companyName: string;
  description: string;
  shares: number;
  buyPrice: number;
  assetClass: string | null;
  purchaseDate: any;
}

export const useVariableActions = () => {
  const user = useUser();
  const firestore = useFirestore;

  const variableRef = firestore().collection("variable");

  const create = useCallback(
    (data: IVariable) => {
      return variableRef.add({ ...data, userId: user.uid });
    },
    [user, variableRef]
  );

  const get = useCallback(
    (uid: string) => {
      return variableRef.where("userId", "==", uid).get();
    },
    [variableRef]
  );

  const update = useCallback(
    (variableId, data) => {
      return variableRef.doc(variableId).update(data);
    },
    [variableRef]
  );

  const destroy = useCallback(
    (variableId) => {
      return variableRef.doc(variableId).delete();
    },
    [variableRef]
  );

  return {
    create,
    get,
    update,
    destroy,
  };
};
