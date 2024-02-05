"use client";
import React, { useEffect, useState } from "react";
import getProjectById from "../services/getProjectById";
import getClients from "../services/getClients";
import { modalSchema } from "../validations/modalValidation";
import * as yup from "yup";
import { Modal, Button, TextField, FormControl, Box } from "@mui/material";
import ClientNameAutocomplete from "./ClientNameAutocomplete";
import addProject from "../services/addProject";

const ProjectsModal = ({ open, onClose, projectId }) => {
  const [clientsList, setClientsList] = useState([]);
  const [project, setProject] = useState({});
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const getClientsCall = async () => {
      let res = await getClients();
      setClientsList(res.data);
    };

    const getProjectByIdCall = async (id) => {
      if (id != 0) {
        console.log("is editing");
        setErrors({});
        let res = await getProjectById(id);
        let temp = {
          id: projectId,
          name: res.data.name,
          description: res.data.description,
          clientName: res.data.client.name,
        };
        setProject(temp);
      } else {
        setErrors({});
        console.log("new entry");
        setProject({ id: 0, name: "", description: "", clientName: "" });
      }
    };
    getProjectByIdCall(projectId);
    getClientsCall();
  }, [projectId, open]);

  const handleChange = (e) => {
    let temp = { ...project, [e.target.name]: e.target.value };
    let nextErrors = { ...errors };
    try {
      modalSchema.validateSyncAt(e.target.name, temp);
      nextErrors[e.target.name] = [];
    } catch (error) {
      console.log("error");
      nextErrors[e.target.name] = error.errors;
    }
    setErrors(nextErrors);
    setProject(temp);
  };

  const handleAddProject = async () => {
    try {
      modalSchema.validateSync(project, { abortEarly: false });
      let res = await addProject(projectId, project);

      onClose(true)();
      // console.log(res);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        let nextErrors = {};
        error.inner.forEach((vError) => {
          nextErrors[vError.path] = vError.errors;
        });
        setErrors(nextErrors);
      }
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            border: "2px solid black",
            borderRadius: "10px",
            width: "auto",
            backgroundColor: "white",
            padding: "20px",
          }}
        >
          <FormControl size="medium">
            <ClientNameAutocomplete
              clientsList={clientsList}
              errors={errors}
              setErrors={setErrors}
              project={project}
              setProject={setProject}
            />
            <TextField
              sx={{ width: "auto", marginTop: "1rem", marginBottom: "1rem" }}
              fullWidth
              label="Project Name"
              onChange={handleChange}
              error={errors?.name?.length ? true : false}
              value={project?.name}
              name="name"
            />
            <TextField
              sx={{ width: "auto", marginTop: "1rem", marginBottom: "1rem" }}
              fullWidth
              label="Description"
              onChange={handleChange}
              error={errors?.description?.length ? true : false}
              value={project?.description}
              name="description"
            />
          </FormControl>

          <Box>
            <Button
              variant="outlined"
              sx={{ float: "left" }}
              onClick={onClose(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ float: "right" }}
              onClick={handleAddProject}
            >
              {projectId == 0 ? "Add Project" : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ProjectsModal;
