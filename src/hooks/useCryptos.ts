import { useCallback } from "react";
import { useFirestore } from "reactfire";
import useUser from "./useUser";

/**
 * Cryptos functions
 */

interface ICryptos {
  symbol: string;
  name: string;
  buyPrice: number;
  purchaseDate: any;
  amount: number;
}

export const useCryptosActions = () => {
  const user = useUser();
  const firestore = useFirestore;

  const cryptosRef = firestore().collection("cryptocurrencies");

  const create = useCallback(
    (data: ICryptos) => {
      return cryptosRef.add({
        ...data,
        userId: user.uid,
        assetClass: "Cryptocurrencies",
      });
    },
    [user, cryptosRef]
  );

  const get = useCallback(
    (uid: string) => {
      return cryptosRef.where("userId", "==", uid).get();
    },
    [cryptosRef]
  );

  const update = useCallback(
    (cryptoId, data) => {
      return cryptosRef.doc(cryptoId).update({
        ...data,
        assetClass: "Cryptocurrencies",
      });
    },
    [cryptosRef]
  );

  const destroy = useCallback(
    (cryptoId) => {
      return cryptosRef.doc(cryptoId).delete();
    },
    [cryptosRef]
  );

  return {
    create,
    get,
    update,
    destroy,
  };
};
