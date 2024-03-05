"use client";

import { tTheme } from "@/lib/components/theme";
import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import { register } from "@/lib/services/user";
import { userRegistrationSchema } from "@/lib/validation";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import OutlinedInput from "@/lib/components/OulinedInput";
import { produce } from "immer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";

function RegistrationPage() {
  const [user, setUser] = useState({
    userName: "",
    userEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const SCHEMA = userRegistrationSchema();
  const ROUTER = useRouter();

  useEffect(() => {
    let user = getUserFromLocalStorage();
    if (user) {
      ROUTER.push("/");
    }
  }, []);

  const handleChange = (name) => (event) => {
    let nextErrors = { ...errors };
    let nextState = produce(user, (draft) => {
      switch (name) {
        case "userName":
        case "userEmail":
        case "password":
          draft[name] = event.target.value;
          break;

        default:
          break;
      }

      try {
        SCHEMA.validateSyncAt(name, draft);
        nextErrors[name] = [];
      } catch (e) {
        nextErrors[name] = [...e.errors];
      }
    });

    setUser(nextState);
    setErrors(nextErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      SCHEMA.validateSync(user, { abortEarly: false });

      let response = await register(user);
      if (response.status === "success") {
        toast.success("User registered successfully.");
        setTimeout(() => {
          ROUTER.push("/login");
        }, 1000);
      } else {
        let { status } = response;
        if (status === "conflict") {
          toast.error(response.errors);
        } else if (status === "invalid") {
          setErrors(response.validationErrors);
        } else {
          toast.error(e.errors);
        }
      }
    } catch (e) {
      if (e instanceof yup.ValidationError) {
        let newEr = produce({}, (draft) => {
          e.inner.forEach((error) => {
            draft[error.path] = [...error.errors];
          });
        });
        setErrors(newEr);
      }
    }
  };

  return (
    // (
    //   <Box
    //     sx={{
    //       display: "flex",
    //       justifyContent: "center",
    //       alignItems: "center",
    //       height: "80vh",
    //     }}
    //   >
    //     <Box
    //       component="form"
    //       sx={{
    //         padding: "60px",
    //         display: "flex",
    //         flexDirection: "column",
    //         width: "500px",
    //         borderRadius: "20px",
    //         backgroundColor: tTheme.palette.white,
    //       }}
    //     >
    //       <Typography sx={{ marginBottom: "20px" }} variant="h4">
    //         Register
    //       </Typography>

    //       <FormControl sx={{ marginBottom: "10px" }}>
    //         <OutlinedInput
    //           size="small"
    //           placeholder="User Name"
    //           value={user?.userName}
    //           onChange={handleChange("userName")}
    //           error={errors && errors?.userName?.length}
    //         />
    //         <FormHelperText sx={{ color: "red", marginLeft: "0px" }}>
    //           {errors && errors.userName}
    //         </FormHelperText>
    //       </FormControl>
    //       <FormControl sx={{ marginBottom: "10px" }}>
    //         <OutlinedInput
    //           size="small"
    //           placeholder="Email"
    //           value={user?.userEmail}
    //           onChange={handleChange("userEmail")}
    //           error={errors && errors?.userEmail?.length}
    //         />
    //         <FormHelperText sx={{ color: "red", marginLeft: "0px" }}>
    //           {errors && errors.userEmail}
    //         </FormHelperText>
    //       </FormControl>
    //       <FormControl sx={{ marginBottom: "10px" }}>
    //         <OutlinedInput
    //           size="small"
    //           placeholder="Password"
    //           value={user?.password}
    //           onChange={handleChange("password")}
    //           error={errors && errors?.password?.length}
    //           type="password"
    //         />
    //         <FormHelperText sx={{ color: "red", marginLeft: "0px" }}>
    //           {errors && errors.password}
    //         </FormHelperText>
    //       </FormControl>
    //       <FormControl>
    //         <Button
    //           variant="outlined"
    //           sx={{ marginTop: "10px", width: "200px" }}
    //           size="small"
    //           startIcon={<AppRegistrationIcon />}
    //           onClick={handleSubmit}
    //         >
    //           Register
    //         </Button>
    //       </FormControl>
    //     </Box>
    //   </Box>
    // );
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <OutlinedInput
                  onChange={handleChange("userName")}
                  value={user?.userName}
                  isError={errors && errors?.userName?.length}
                  error={errors && errors?.userName}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <OutlinedInput
                  onChange={handleChange("userEmail")}
                  value={user?.userEmail}
                  isError={errors && errors?.userEmail?.length}
                  error={errors && errors?.userEmail}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <OutlinedInput
                  onChange={handleChange("password")}
                  value={user?.password}
                  isError={errors && errors?.password?.length}
                  error={errors && errors?.password}
                  type="password"
                />
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RegistrationPage;
