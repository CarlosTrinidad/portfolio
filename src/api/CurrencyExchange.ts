import axios from "axios";

const http = axios.create({
  baseURL: process.env.REACT_APP_CURRENCY_EXCHANGE_URL,
  headers: {
    "content-type": "application/octet-stream",
    "x-rapidapi-host": "currency-exchange.p.rapidapi.com",
    "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
    useQueryString: true,
  },
});

export default http;
