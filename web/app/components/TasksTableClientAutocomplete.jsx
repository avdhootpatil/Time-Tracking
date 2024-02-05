import React, { useContext, useEffect, useState } from "react";
import getClients from "../services/getClients";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { AutocompleteContext } from "./TasksDrawer";

const TasksTableClientAutocomplete = ({ handleChange, index, value }) => {
  const [clientsOptions, setClientsOptions] = useState([]);
  const [selectedClient, setSelectedClient] = useState({ label: "" });
  // const [selectedClient, setSelectedClient] = useContext(AutocompleteContext);
  const [inputVal, setInputVal] = useState(value);
  useEffect(() => {
    let tempClientsList = [];
    (async () => {
      let res = await getClients();
      // console.log(res);
      tempClientsList = res.data;
      //   console.log(tempClientsList);
      let tempClientsOptions = tempClientsList.map((client) => ({
        label: client.name,
      }));
      tempClientsOptions.unshift({ label: "" });
      setClientsOptions(tempClientsOptions);
      setSelectedClient(clientsOptions?.[0]);
    })();
    // console.log(tempClientsList);
  }, []);

  // const demo = () => {
  //   console.log("demo");
  // };
  return (
    <>
      <Autocomplete
        disablePortal
        // //   id="combo-box-demo"
        // //   options={top100Films}
        //   sx={{ width: 300 }}
        options={clientsOptions}
        value={value}
        onChange={(e, val) => {
          setSelectedClient(val);
          handleChange(index, val?.label, "clientName")();
        }}
        inputValue={value}
        onInputChange={(e, val) => {
          // setInputVal(val);
          // console.log(e.target.name);
          // console.log("client changed");
          handleChange(index, val, "clientName")();
        }}
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Client"
            name="clientName"
            onChange={() => {
              // console.log(params);
            }}
          />
        )}
      />{" "}
    </>
  );
};

export default TasksTableClientAutocomplete;
