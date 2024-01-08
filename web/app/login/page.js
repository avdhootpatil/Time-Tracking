"use client";

import { tTheme } from "@/lib/components/theme";
import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import { login } from "@/lib/services/user";
import { userLoginSchema } from "@/lib/validation";
import LoginIcon from "@mui/icons-material/Login";
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

export default function LoginPage() {
  const [user, setUser] = useState({
    userEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const SCHEMA = userLoginSchema();
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

      let response = await login(user);
      if (response.status === "success") {
        toast.success("Logged in successfully!");

        localStorage.setItem("user", JSON.stringify(response.data));

        setTimeout(() => {
          ROUTER.push("/client");
        }, 1000);
      } else {
        let { status } = response;
        if (status === "notFound" || status === "unauthorized") {
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
          Login
        </Typography>

        <FormControl sx={{ marginBottom: "10px" }}>
          <OutlinedInput
            size="small"
            placeholder="Email"
            onChange={handleChange("userEmail")}
            value={user?.userEmail}
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
            onChange={handleChange("password")}
            value={user?.password}
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
            size="small"
            sx={{ marginTop: "10px", width: "200px" }}
            startIcon={<LoginIcon />}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
}
