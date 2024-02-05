"use client";

import React, { useState } from "react";
import { Paper, Button, Box, TextField, FormLabel, Stack } from "@mui/material";
import { loginSchema } from "../validations/loginValidation";
import loginUser from "../services/loginUser";
import { FamilyRestroomSharp } from "@mui/icons-material";
import * as yup from "yup";

const LoginForm = () => {
  const [loginInfo, setLoginInfo] = useState({
    userName: "",
    userEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    let tempLoginInfo = { ...loginInfo };

    tempLoginInfo[e.target.name] = e.target.value;
    let nextErrors = { ...errors };
    try {
      loginSchema.validateSyncAt(e.target.name, tempLoginInfo);
      nextErrors[e.target.name] = [];
    } catch (error) {
      // console.log("error");
      nextErrors[e.target.name] = error.errors;
    }
    setErrors(nextErrors);

    setLoginInfo(tempLoginInfo);
    // console.log(tempLoginInfo);
  };

  const handleSubmit = async () => {
    // console.log("login info submitted");
    try {
      loginSchema.validateSync(loginInfo, { abortEarly: false });
      let res = await loginUser(loginInfo);
      let { id, email, token } = res.data;
      localStorage.setItem("token", token);
      console.log("from loginform");
      console.log(res);
    } catch (error) {
      let nextErrors = {};
      if (error instanceof yup.ValidationError) {
        console.log(error.inner);
        error.inner.forEach((vError) => {
          nextErrors[vError.path] = vError.errors;
        });
      }
      setErrors(nextErrors);
    }
  };
  return (
    <>
      <Paper
        sx={{
          maxWidth: "30rem",
          marginLeft: "auto",
          marginRight: "auto",
          //   backgroundColor: "#eee",
        }}
      >
        <Stack sx={{ padding: "1rem" }} spacing={2}>
          <FormLabel
            sx={{ fontWeight: "bold", fontSize: "1.3rem", color: "black" }}
          >
            Login
          </FormLabel>

          <TextField
            label="Username"
            type="text"
            onChange={handleChange}
            // sx={{ backgroundColor: "white" }}
            name="userName"
            size="small"
            error={errors?.userName?.length > 0 ? true : false}
          />
          <TextField
            label="Email"
            type="email"
            onChange={handleChange}
            // sx={{ backgroundColor: "white" }}
            name="userEmail"
            size="small"
            error={errors?.userEmail?.length > 0 ? true : false}
          />
          <TextField
            label="Password"
            type="password"
            onChange={handleChange}
            // sx={{ backgroundColor: "white" }}
            name="password"
            size="small"
            error={errors?.password?.length > 0 ? true : false}
          />

          <Box>
            <Button
              sx={{
                display: "block",
                marginLeft: "auto",
                padding: "0.5rem",
                width: "auto",
              }}
              onClick={handleSubmit}
              variant="contained"
            >
              Login
            </Button>
          </Box>
        </Stack>
      </Paper>
    </>
  );
};

export default LoginForm;
