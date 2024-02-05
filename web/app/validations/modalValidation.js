import * as yup from "yup";

export const modalSchema = yup.object({
  clientName: yup.string().required(),
  name: yup.string().required(),
  description: yup.string().required(),
});
