import * as yup from "yup";

const holidaySchema = () => {
  return yup.object({
    date: yup.string().required("Date is required"),
    description: yup.string().required("Description is required"),
  });
};

export default holidaySchema;
