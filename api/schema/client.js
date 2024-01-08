import yup from "yup";

const clientSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
});

export default clientSchema;
