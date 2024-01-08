"use client";

import { tTheme } from "@/lib/components/theme";
import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import { register } from "@/lib/services/user";
import { userRegistrationSchema } from "@/lib/validation";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Typography,
} from "@mui/material";
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
      ROUTER.push("/client");
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <Box
        component="form"
        sx={{
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          width: "500px",
          borderRadius: "20px",
          backgroundColor: tTheme.palette.white,
        }}
      >
        <Typography sx={{ marginBottom: "20px" }} variant="h4">
          Register
        </Typography>

        <FormControl sx={{ marginBottom: "10px" }}>
          <OutlinedInput
            size="small"
            placeholder="User Name"
            value={user?.userName}
            onChange={handleChange("userName")}
            error={errors && errors?.userName?.length}
          />
          <FormHelperText sx={{ color: "red", marginLeft: "0px" }}>
            {errors && errors.userName}
          </FormHelperText>
        </FormControl>
        <FormControl sx={{ marginBottom: "10px" }}>
          <OutlinedInput
            size="small"
            placeholder="Email"
            value={user?.userEmail}
            onChange={handleChange("userEmail")}
            error={errors && errors?.userEmail?.length}
          />
          <FormHelperText sx={{ color: "red", marginLeft: "0px" }}>
            {errors && errors.userEmail}
          </FormHelperText>
        </FormControl>
        <FormControl sx={{ marginBottom: "10px" }}>
          <OutlinedInput
            size="small"
            placeholder="Password"
            value={user?.password}
            onChange={handleChange("password")}
            error={errors && errors?.password?.length}
            type="password"
          />
          <FormHelperText sx={{ color: "red", marginLeft: "0px" }}>
            {errors && errors.password}
          </FormHelperText>
        </FormControl>
        <FormControl>
          <Button
            variant="outlined"
            sx={{ marginTop: "10px", width: "200px" }}
            size="small"
            startIcon={<AppRegistrationIcon />}
            onClick={handleSubmit}
          >
            Register
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
}

export default RegistrationPage;
