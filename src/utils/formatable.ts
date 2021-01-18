export const toCurrency = (value: number) => {
  if (typeof value !== "number") {
    value = Number(value);
  }
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
  return formatter.format(value);
};

export const toDecimal = (value: number) => {
  if (typeof value !== "number") {
    value = Number(value);
  }
  var formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
  });
  return formatter.format(value);
};

export const toInteger = (value: number) => {
  if (typeof value !== "number") {
    value = Number(value);
  }
  var formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
};

export const toPrecise = (value: number) => {
  if (typeof value !== "number") {
    value = Number(value);
  }
    return value.toPrecision(8);
};
