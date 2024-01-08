import yup from "yup";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

const userSchema = yup.object({
  userName: yup.string().required("User name is required "),
  userEmail: yup
    .string()
    .matches(emailRegex, "Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .matches(
      passwordRegex,
      "Password must contain at least 8 characters, one lowercase letter, one uppercase letter, and one number"
    )
    .required("Password is required"),
});

export default userSchema;
