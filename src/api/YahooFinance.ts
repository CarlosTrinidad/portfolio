import axios from "axios";

const http = axios.create({
  baseURL: process.env.REACT_APP_YAHOO_FINANCE_URL,
  headers: {
    "Cache-Control": "no-cache",
    "content-type": "application/octet-stream",
    "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
    "x-rapidapi-key": process.env.REACT_APP_YAHOO_FINANCE_APIK_KEY,
    useQueryString: true,
  },
});

export default http;
