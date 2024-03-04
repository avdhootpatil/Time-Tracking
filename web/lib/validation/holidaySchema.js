import * as yup from "yup";

const holidaySchema = () => {
  return yup.object({
    date: yup
      .mixed()
      .required("Date is required")
      .test("isValidDate", "Invalid date", function (value) {
        // Perform custom validation if needed
        // You may check if it's a valid Date object or a valid date string
        return (
          value instanceof Date ||
          (typeof value === "string" && !isNaN(Date.parse(value)))
        );
      }),
    description: yup.string().required("Description is required"),
  });
};

export default holidaySchema;
