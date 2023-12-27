import yup from "yup";

const userSchema = yup.object({
  username: yup.string().nullable(),
  userEmail: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default userSchema;
