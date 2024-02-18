import { getTaskObject, getTaskPostPayload } from "@/lib/helperFunctions";
import { saveTask } from "@/lib/services/timesheet";
import { Box, FormControl, Modal, TextField, Typography } from "@mui/material";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { modalStyle } from "../../styles/modalStyles";
import Select from "../select";
import StyledButton from "../styledButton";

const TaskModal = ({
  isModalOpen = false,
  closeModal = () => {},
  task = null,
  user = null,
  mode = "new",
  clients = [],
  projects = [],
  date = null,
}) => {
  const [currentTask, setCurrentTask] = useState(getTaskObject());
  const [errors, setErrors] = useState({});

  //   const SCHEMA = clientSchema();

  useEffect(() => {
    (async () => {
      setCurrentTask(task);
    })();
  }, [task]);

  const handleChange = (name) => (e) => {
    let nextState = produce(currentTask, (draft) => {
      switch (name) {
        case "taskName":
          draft[name] = e.target.value;
          break;

        case "estimateValue":
          draft[name] = e.target.value;
          break;

        case "azureValue":
          draft[name] = e.target.value;
          break;

        case "userStoryNumber":
          draft[name] = e.target.value;
          break;

        case "taskNumber":
          draft[name] = e.target.value;
          break;

        case "client":
          draft[name] = e;
          break;

        case "project":
          draft[name] = e;
          break;

        default:
          break;
      }
    });

    setCurrentTask(nextState);
  };

  const handleSave = async () => {
    let postPayload = getTaskPostPayload(date, currentTask);
    let response = await saveTask(postPayload, user?.token);
    if (response.status === "success") {
      toast.success("Successfully saved");
      closeModal(true)(null);
    } else {
      toast.error("Unable to save task");
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
          <Typography>
            <h3>Task</h3>
          </Typography>
          <Box
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
              <TextField
                size="small"
                onChange={handleChange("taskName")}
                value={currentTask?.taskName}
                multiline
                rows={2}
                sx={{ width: "100%" }}
                placeholder="Task Name"
              />
            </FormControl>

            <FormControl
              variant="outlined"
              sx={{ width: "100%", marginBottom: "10px" }}
              className="form-row-margin-bottom"
            >
              <TextField
                size="small"
                value={currentTask?.estimateValue}
                onChange={handleChange("estimateValue")}
                type="number"
                sx={{ width: "100%" }}
                placeholder="Estimate Value"
              />
            </FormControl>
            <FormControl
              variant="outlined"
              sx={{ width: "100%", marginBottom: "10px" }}
              className="form-row-margin-bottom"
            >
              <TextField
                size="small"
                value={currentTask?.azureValue}
                onChange={handleChange("azureValue")}
                type="number"
                sx={{ width: "100%" }}
                placeholder="Azure Value"
              />
            </FormControl>
            <FormControl
              variant="outlined"
              sx={{ width: "100%", marginBottom: "10px" }}
              className="form-row-margin-bottom"
            >
              <TextField
                size="small"
                value={currentTask?.userStoryNumber}
                onChange={handleChange("userStoryNumber")}
                type="number"
                sx={{ width: "100%" }}
                placeholder="User Story Number"
              />
            </FormControl>
            <FormControl
              variant="outlined"
              sx={{ width: "100%", marginBottom: "10px" }}
              className="form-row-margin-bottom"
            >
              <TextField
                size="small"
                value={currentTask?.taskNumber}
                onChange={handleChange("taskNumber")}
                type="number"
                sx={{ width: "100%" }}
                placeholder="Task Number"
              />
            </FormControl>
            <FormControl
              variant="outlined"
              sx={{ width: "100%", marginBottom: "10px" }}
              className="form-row-margin-bottom"
            >
              <Select
                onSelect={handleChange("client")}
                value={currentTask?.client}
                nameProperty="name"
                valueProperty="id"
                options={clients}
                placeholder="Select Client"
              />
            </FormControl>

            <FormControl
              variant="outlined"
              sx={{ width: "100%", marginBottom: "10px" }}
              className="form-row-margin-bottom"
            >
              <Select
                onSelect={handleChange("project")}
                value={currentTask?.project}
                nameProperty="name"
                valueProperty="id"
                options={projects}
                placeholder="Select Project"
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

              <StyledButton label="Cancel" onClick={closeModal(false)} />
            </Box>
          </Box>
        </>
      </Box>
    </Modal>
  );
};

export default TaskModal;
