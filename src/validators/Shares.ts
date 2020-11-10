import * as yup from "yup";

export const create = yup.object().shape({
  symbol: yup.string().label("symbol").required(),
  companyName: yup.string().label("company name").required(),
  description: yup.string().label("description"),
  shares: yup.number().min(1).integer().label("shares").required(),
  buyPrice: yup.number().moreThan(0).label("buy price").required(),
  assetClass: yup.string().label("asset class").nullable(),
  purchaseDate: yup.date().label("purchase date"),
});
