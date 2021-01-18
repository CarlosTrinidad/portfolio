import currencyExchange from "../api/CurrencyExchange";
import { useCallback } from "react";

/**
 * Get the currency exchange by specifying the quotes of soruce (from) and destination (to)
 *
 * @return {Function} any
 */

interface requestParams {
  from: string;
  q: string;
  to: string;
}

const useCurrencyExchange = () => {
  const setQuotes = useCallback(async (params: requestParams) => {
    let result = 0;

    if (
      params.from.length === 0 ||
      params.to.length === 0 ||
      params.q.length === 0
    ) {
      return result;
    }

    try {
      let response = await currencyExchange.get("/exchange", {
        params: {
          from: params.from,
          q: params.q,
          to: params.to,
        },
      });

      if (!!response.data) {
        result = response.data;
      }
    } catch (error) {
      console.log(error);
    }

    return result;
  }, []);

  return setQuotes;
};

export default useCurrencyExchange;
