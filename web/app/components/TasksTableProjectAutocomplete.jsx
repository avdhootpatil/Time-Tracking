import React, { useState, useEffect, useContext } from "react";
import getProjects from "../services/getProjects";
import { Autocomplete, TextField } from "@mui/material";
import { AutocompleteContext } from "./TasksDrawer";

const TasksTableProjectAutocomplete = ({ handleChange, index, value }) => {
  const [projectsOptions, setProjectsOptions] = useState([]);

  const [selectedProject, setSelectedProject] = useState({ label: "" });
  // const [, , selectedProject, setSelectedProject] =
  // useContext(AutocompleteContext);
  const [inputVal, setInputVal] = useState(selectedProject?.label);
  useEffect(() => {
    let tempProjectsList = [];
    (async () => {
      let res = await getProjects();
      // console.log(res);
      console.log();
      tempProjectsList = res.data;
      //   console.log(tempClientsList);
      let tempProjectsOptions = tempProjectsList.map((project) => ({
        label: project.name,
      }));
      tempProjectsOptions.unshift({ label: "" });
      setProjectsOptions(tempProjectsOptions);
      let tempSelectedProject = tempProjectsOptions.filter(
        (proj) => proj.label == value
      );
      setSelectedProject(tempSelectedProject?.[0]);
    })();
    // console.log(tempProjectsList);
  }, []);
  return (
    <>
      <Autocomplete
        disablePortal
        options={projectsOptions}
        value={value}
        onChange={(e, val) => {
          // setSelectedProject(val);
          // console.log(val?.label);
          handleChange(index, val?.label, "projectName")();
        }}
        inputValue={value}
        onInputChange={(e, val) => {
          // setInputVal(val);
          handleChange(index, val, "projectName")();
          // console.log(val);
          // debugger;
        }}
        size="small"
        renderInput={(params) => (
          <TextField {...params} label="Project" sx={{ marginTop: "0.4rem" }} />
        )}
      />
    </>
  );
};

export default TasksTableProjectAutocomplete;
