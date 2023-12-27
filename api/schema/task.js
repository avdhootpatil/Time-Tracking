import yup from "yup";

const taskSchema = yup.object({
  taskName: yup.string().required("Task name is required"),
  clientId: yup.number().required("Client ID is required"),
  projectId: yup.number().required("Project ID is required"),
  estimateValue: yup.number().required("Estimate value is required"),
  azureValue: yup.number().required("Azure value is required"),
  userStoryNumber: yup.number().required("User story number is required"),
  taskNumber: yup.number().required("Task number is required"),
  userId: yup.number().required("User ID is required"),
});

export default taskSchema;
