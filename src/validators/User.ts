import * as yup from "yup";

export const create = yup.object().shape({
  email: yup.string().label("email").email().required(),
  password: yup.string().label("password").min(6).required(),
  confirmPassword: yup
    .string()
    .label("password confirmation")
    .required()
    .oneOf([yup.ref("password"), ""], "Passwords must match"),
});

export const login = yup.object().shape({
  email: yup.string().label("email").email().required(),
  password: yup.string().label("password").required(),
});

export const forgotPassword = yup.object().shape({
  email: yup.string().label("email").email().required(),
});
