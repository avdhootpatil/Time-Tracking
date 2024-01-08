import * as yup from "yup";

const projectSchema = () => {
  return yup.object({
    name: yup.string().required("Client Name is required"),
    description: yup.string().required("Client description is required"),
    client: yup.object().required("Client is required"),
  });
};

export default projectSchema;
