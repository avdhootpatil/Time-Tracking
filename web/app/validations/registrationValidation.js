import * as yup from "yup";

export const registrationSchema = yup.object({
  userName: yup.string().required(),
  userEmail: yup.string().email().required(),
  password: yup.string().required(),
});
