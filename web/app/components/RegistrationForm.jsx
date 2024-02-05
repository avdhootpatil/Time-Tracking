"use client";

import {
  Box,
  Button,
  FormHelperText,
  FormLabel,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import registerUser from "../services/RegisterUser";
import { registrationSchema } from "../validations/registrationValidation";

const RegistrationForm = () => {
  const [userCredentials, setUserCredentials] = useState({
    userName: "",
    userEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    let tempUserCredentials = { ...userCredentials };

    tempUserCredentials[e.target.name] = e.target.value;
    let nextErrors = { ...errors };
    try {
      registrationSchema.validateSyncAt(e.target.name, tempUserCredentials);
      nextErrors[e.target.name] = [];
    } catch (error) {
      console.log("error");
      nextErrors[e.target.name] = error.errors;
    }
    setErrors(nextErrors);

    setUserCredentials({
      userName: tempUserCredentials.userName,
      userEmail: tempUserCredentials.userEmail,
      password: tempUserCredentials.password,
    });
    console.log(userCredentials);
  };

  const handleSubmit = () => {
    console.log("registration info submitted");
    try {
      registrationSchema.validateSync(userCredentials, { abortEarly: false });
      registerUser(userCredentials);
    } catch (error) {
      let nextErrors = {};
      console.log(error.inner);
      error.inner.forEach((vError) => {
        nextErrors[vError.path] = vError.errors;
      });

      setErrors(nextErrors);
    }
  };

  return (
    <>
      <Paper
        sx={{ maxWidth: "30rem", marginLeft: "auto", marginRight: "auto" }}
      >
        <Stack sx={{ padding: "1rem" }} spacing={2}>
          <FormLabel
            sx={{ fontWeight: "bold", fontSize: "1.3rem", color: "black" }}
          >
            Register
          </FormLabel>

          <TextField
            label="Username"
            type="text"
            onChange={handleChange}
            name="userName"
            size="small"
            error={errors?.userName?.length > 0 ? true : false}
          />
          <TextField
            label="Email"
            type="email"
            onChange={handleChange}
            name="userEmail"
            size="small"
            error={errors?.userEmail?.length > 0 ? true : false}
          />
          <TextField
            label="Password"
            type="password"
            onChange={handleChange}
            name="password"
            size="small"
            error={errors?.password?.length > 0 ? true : false}
          />

          {/* <TextField
            label="Confirm Password"
            type="password"
            onChange={handleChange}
            name="passwordConfirmation"
            size="small"
          /> */}
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
              Register
            </Button>
          </Box>
        </Stack>
      </Paper>
    </>
  );
};

export default RegistrationForm;
