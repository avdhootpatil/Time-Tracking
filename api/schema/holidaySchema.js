import yup from "yup";

const holidaySchema = yup.object({
  date: yup.string().required("Date is required"),
  description: yup.string().required("Description is required"),
});

export default holidaySchema;
