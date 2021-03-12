import moment from "moment";

export const stringSorter = (a: string, b: string) => a.localeCompare(b);
export const numberSorter = (a: number, b: number) => a - b;
export const dateSorter = (a: string, b: string) =>
  moment(a, "YYYY-MM-DD").diff(moment(b, "YYYY-MM-DD"));
