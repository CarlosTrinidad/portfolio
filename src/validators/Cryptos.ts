import * as yup from "yup";

export const create = yup.object().shape({
  symbol: yup.string().label("symbol").required(),
  name: yup.string().label("name").required(),
  amount: yup.number().moreThan(0).label("amount").required(),
  buyPrice: yup.number().label("buy price").required(),
  assetClass: yup.string().label("asset class").nullable(),
  purchaseDate: yup.date().label("purchase date"),
});
