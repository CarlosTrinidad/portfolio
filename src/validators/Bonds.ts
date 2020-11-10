import * as yup from "yup";

export const create = yup.object().shape({
  name: yup.string().label("name").required(),
  deadline: yup.number().moreThan(0).integer().label("deadline").required(),
  rate: yup.number().moreThan(0).label("rate").required(),
  amount: yup.number().moreThan(0).label("amount").required(),
  grossReturn: yup.number().moreThan(0).label("gross return").required(),
  startDate: yup.date().label("start date").required(),
  expirationDate: yup.date().label("expiration date").required(),
  assetClass: yup.string().label("asset class").nullable(),
});
