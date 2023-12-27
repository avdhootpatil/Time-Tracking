import yup from "yup";

const clientSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().nullable(),
});

export default clientSchema;
