import React, { useEffect, useState, createContext, useContext } from "react";
import { Box, Button, Drawer } from "@mui/material";
import TasksTable from "./TasksTable";
import getTasksByDate from "../services/getTasksByDate";
import addTimeEntry from "../services/addTimeEntry";

export const AutocompleteContext = createContext();
const TasksDrawer = ({ open, onClose, selectedDate }) => {
  const [selectedProject, setSelectedProject] = useState({});
  const [selectedClient, setSelectedClient] = useState({});

  const [tasksForSelectedDay, setTasksForSelectedDay] = useState([]);
  useEffect(() => {
    (async () => {
      if (selectedDate) {
        let res = await getTasksByDate(selectedDate);
        // console.log(res);
        // console.log(selectedDate);
        // console.log(res.data);
        setTasksForSelectedDay(res.data);
      }
    })();
  }, [open]);

  const handleChange =
    (index, val = "", name = "") =>
    (e) => {
      // debugger;
      let temp = [...tasksForSelectedDay];
      let key = e?.target?.name ? e.target.name : name;
      if (key == "clientName") {
        // temp[index].client.name = e.target.value;
        // console.log(name);
        temp[index].client.name = val;
      } else if (key == "projectName") {
        // temp[index].project.name = e.target.value;
        temp[index].project.name = val;
      } else if (key == "projectDescription") {
        temp[index].project.description = e.target.value;
      } else if (key == "userName") {
        temp[index].user.userName = e.target.value;
      } else {
        temp[index] = {
          ...temp[index],
          [key]: e.target.value,
        };
      }

      setTasksForSelectedDay(temp);
    };

  const handleAddTask = (index) => (e) => {
    console.log("handleAddTask");

    let temp = {
      taskId: "",
      taskName: "",
      estimateValue: "",
      azureValue: "",
      userStoryNumber: "",
      taskNumber: "",
      client: { id: 0, name: "" },
      project: { id: 0, name: "", description: "" },
      user: { id: 0, userName: "" },
    };
    setTasksForSelectedDay((prev) => {
      let before = prev.slice(0, index + 1);
      let after = prev.slice(index + 1);
      return [...before, temp, ...after];
    });
  };

  const handleSaveTasks = async () => {
    console.log("tasks have been saved");

    let payload = {
      userId: 11,
      taskDate: selectedDate,
      tasks: tasksForSelectedDay,
    };
    //make post request to api
    let res = await addTimeEntry(payload);
    console.log(res);
    console.log(payload);
  };

  const handleDeleteTask = (index) => (e) => {
    console.log("task deleted");
    let temp = [...tasksForSelectedDay];
    temp.splice(index, 1);
    setTasksForSelectedDay(temp);
  };
  return (
    <>
      <AutocompleteContext.Provider
        value={
          [
            // selectedClient,
            // setSelectedClient,
            // selectedProject,
            // setSelectedProject,
          ]
        }
      >
        <Drawer open={open} onClose={onClose} anchor="right">
          <Box sx={{ width: "99vw" }}>
            <TasksTable
              tasks={tasksForSelectedDay}
              handleChange={handleChange}
              handleAddTask={handleAddTask}
              handleDeleteTask={handleDeleteTask}
            />
            <Button
              variant="contained"
              sx={{
                width: "2rem",
                float: "right",
                marginRight: "2rem",
                marginTop: "2rem",
              }}
              onClick={handleSaveTasks}
            >
              Save
            </Button>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                width: "2rem",
                float: "right",
                marginRight: "2rem",
                marginTop: "2rem",
              }}
            >
              Cancel
            </Button>
          </Box>
        </Drawer>
      </AutocompleteContext.Provider>
    </>
  );
};

export default TasksDrawer;
