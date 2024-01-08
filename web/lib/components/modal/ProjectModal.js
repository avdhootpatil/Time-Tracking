"use client";

import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import { getClients } from "@/lib/services/client";
import { getProjectById, saveProject } from "@/lib/services/project";
import { projectSchema } from "@/lib/validation";
import { Box, FormControl, Modal, OutlinedInput } from "@mui/material";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { modalStyle } from "../../styles/modalStyles";
import TSelect from "../TSelect";
import StyledButton from "../styledButton";

const ProjectModal = ({
  isModalOpen = false,
  closeModal = () => {},
  projectId = 0,
}) => {
  const [project, setProject] = useState({
    id: 0,
    name: "",
    description: "",
    client: null,
  });

  const [clients, setClients] = useState([]);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);

  const SCHEMA = projectSchema();

  useEffect(() => {
    (async () => {
      let retrievedUser = getUserFromLocalStorage();

      if (retrievedUser) {
        setUser(retrievedUser);
        let cResponse = await getClients(retrievedUser.token);
        if (cResponse.status === "success") {
          setClients(cResponse.data);
        }

        if (projectId === 0) return;

        let response = await getProjectById(projectId, retrievedUser.token);

        if (response.status === "success") {
          setProject(response.data);
        } else {
          if (response.status === "unauthorized") {
            toast.error(response.errors);
          } else {
            toast.error("Unable to get project");
          }
        }
      }
    })();
  }, [projectId]);

  const clearFields = () => {
    setProject({
      id: 0,
      name: "",
      description: "",
    });
    setErrors({});
  };

  const handleChange = (name) => (event) => {
    let nextErrors = { ...errors };
    let nextState = produce(project, (draft) => {
      switch (name) {
        case "name":
        case "description":
          draft[name] = event.target.value;
          break;

        case "client":
          draft[name] = event;
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
    setProject(nextState);
    setErrors(nextErrors);
  };

  const handleSave = async () => {
    try {
      SCHEMA.validateSync(project, { abortEarly: false });
      let response = await saveProject(
        project?.id || 0,
        {
          id: project?.id,
          projectName: project?.name,
          projectDescription: project?.description,
          clientId: project?.client?.id || 0,
        },
        user.token
      );

      if (response.status === "success") {
        closeModal(true);
        clearFields();
      } else {
        toast.error("Unable to save");
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
    <Modal open={isModalOpen}>
      <Box
        component="form"
        sx={{
          ...modalStyle,
          "& .MuiTextField-root": { m: 0 },
          width: 600,
          maxWidth: 1000,
          padding: "30px",
        }}
        noValidate
        autoComplete="off"
        className="container-margin"
      >
        <>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
            noValidate
            autoComplete="off"
            className="container-margin"
          >
            <FormControl
              variant="outlined"
              sx={{ width: "100%", marginRight: "1%", marginBottom: "10px" }}
            >
              <OutlinedInput
                size="small"
                onChange={handleChange("name")}
                value={project?.name || ""}
                error={errors.name && errors.name.length}
                placeholder="Project Name"
              />
            </FormControl>

            <FormControl
              variant="outlined"
              sx={{ width: "100%", marginBottom: "10px" }}
              className="form-row-margin-bottom"
            >
              <OutlinedInput
                size="small"
                onChange={handleChange("description")}
                value={project?.description || ""}
                error={errors.description && errors.description.length}
                placeholder="Description"
              />
            </FormControl>

            <FormControl
              variant="outlined"
              sx={{ width: "100%", marginBottom: "10px" }}
              className="form-row-margin-bottom"
            >
              <TSelect
                valueProperty="id"
                nameProperty="name"
                placeholder="Select Client"
                sx={{ margin: "0px !important" }}
                options={clients}
                onSelect={handleChange("client")}
                value={project?.client || null}
                error={errors.client && errors.client.length}
              />
            </FormControl>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1",
              }}
            >
              <StyledButton
                label="Save"
                onClick={handleSave}
                sx={{ marginRight: "10px" }}
              />

              <StyledButton
                label="Cancel"
                onClick={() => {
                  closeModal(false);
                  clearFields();
                }}
              />
            </Box>
          </Box>
        </>
      </Box>
    </Modal>
  );
};

export default ProjectModal;
