import * as yup from "yup";

const clientSchema = () => {
  return yup.object({
    name: yup.string().required("Client Name is required"),
    description: yup.string().required("Client description is required"),
  });
};

export default clientSchema;
