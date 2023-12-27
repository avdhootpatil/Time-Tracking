import yup from "yup";

const projectSchema = yup.object({
  name: yup.string().required("Project Name is required"),
  description: yup.string().nullable(),
  clientId: yup.number().required("Client ID is required"),
});

export default projectSchema;
