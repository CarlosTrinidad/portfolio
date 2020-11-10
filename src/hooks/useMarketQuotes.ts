import { useCallback, useState } from "react";

import moment from "moment";
import yFinanceApi from "../api/YahooFinance";

/**
 * Get the market quotes:
 *  1. if not present on local storage, then make an api call and save it in LS
 *  2. if there is a quote missing in local storage, make an api call and update value in LS
 *  3. if every quote is in local storage, retunr de local storage value
 *
 * @return {Function} any
 */

const useMarketQuotes = () => {
  const [quoteInfo, setQuoteInfo] = useState(() => {
    try {
      let quotesStoraged = window.localStorage.getItem("market.quotes");
      return quotesStoraged !== null ? JSON.parse(quotesStoraged) : {};
    } catch (error) {
      return {};
    }
  });

  const setQuotes = useCallback((quotes: Array<string>) => {
    if (quotes.length === 0) return;

    let symbols = quotes.join(",");

    yFinanceApi
      .get("market/get-quotes", {
        params: {
          region: "US",
          lang: "en",
          symbols: symbols,
        },
      })
      .then((response) => {
        let result = response?.data?.quoteResponse?.result;

        if (undefined ?? result) {
          window.localStorage.setItem("market.quotes", JSON.stringify(result));
          window.localStorage.setItem(
            "market.quotes.lastUpdate",
            moment().format("LLLL")
          );
          setQuoteInfo(result);
        }
      })
      .catch((error) => {});
  }, []);

  return [quoteInfo, setQuotes] as const;
};

export default useMarketQuotes;
