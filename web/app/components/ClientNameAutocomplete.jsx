import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { modalSchema } from "../validations/modalValidation";

const ClientNameAutocomplete = ({
  clientsList,
  errors,
  setErrors,
  project,
  setProject,
}) => {
  const [clientsOptions, setClientsOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState({ label: "" });

  useEffect(() => {
    let temp = clientsList.map((client) => ({
      label: client.name,
    }));
    temp.push({ label: "" });
    setClientsOptions(temp);
    setSelectedOption(temp[temp.length - 1]);
  }, [clientsList]);

  useEffect(() => {
    // let temp = clientsOptions.filter(
    //   (client) => client.label == project.clientName
    // )[0];

    let temp;
    for (let i = 0; i < clientsOptions.length; i++) {
      if (clientsOptions[i].label == project.clientName) {
        temp = clientsOptions[i];
        break;
      }
    }

    // console.log(project);
    // console.log(clientsOptions);
    // console.log(temp);
    // console.log(selectedOption);

    setSelectedOption(temp);
  }, [project, clientsOptions]);

  const handleChange = (e, val) => {
    let temp = { ...project, clientName: val?.label };
    let nextErrors = { ...errors };
    try {
      modalSchema.validateSyncAt("clientName", temp);
      nextErrors.clientName = [];
    } catch (error) {
      console.log("error");
      nextErrors.clientName = error.errors;
    }
    setProject(temp);
    setErrors(nextErrors);
  };

  return (
    <Autocomplete
      sx={{ width: "23rem" }}
      options={clientsOptions}
      value={selectedOption}
      onChange={handleChange}
      getOptionLabel={(option) => option.label}
      // isOptionEqualToValue={(option, value) => option === value}
      renderInput={(params) => (
        <TextField
          {...params}
          name="clientName"
          error={errors?.clientName?.length ? true : false}
          value={project?.clientName || ""}
          label="Client Name"
        />
      )}
    />
  );
};

export default ClientNameAutocomplete;
