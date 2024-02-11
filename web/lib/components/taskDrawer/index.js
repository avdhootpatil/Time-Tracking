"use client";

import {
  getTaskObject,
  getTaskPostPayload,
  getUserFromLocalStorage,
} from "@/lib/helperFunctions";
import { getClients } from "@/lib/services/client";
import { getProjects } from "@/lib/services/project";
import {
  addTimeEntry,
  deleteTask,
  getTaskByDate,
} from "@/lib/services/timesheet";
import { Box, Button, Drawer } from "@mui/material";
import dayjs from "dayjs";
import { produce } from "immer";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TaskModal } from "../modal";
import { TasksTable } from "../table";
import DeletePopper from "../deletePopper";

const TasksDrawer = ({
  open = false,
  onClose = () => {},
  selectedDate = null,
}) => {
  const [tasksForSelectedDay, setTasksForSelectedDay] = useState([]);
  const [user, setUser] = useState(null);

  // modal states
  const [task, setTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);

  //delete popper states
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeletePopperOpen, setIsDeletePopperOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  useEffect(() => {
    (async () => {
      if (open && selectedDate) {
        let user = getUserFromLocalStorage();
        setUser(user);

        if (user) {
          let currentDate = selectedDate.split("T")[0];
          let response = await getTaskByDate(currentDate, user.token);
          if (response.status === "success") {
            if (response.data.length) {
              setTasksForSelectedDay(response?.data);
            }

            //get projects
            let pResponse = await getProjects(user?.token);
            if (pResponse.status === "success") {
              setProjects(pResponse.data);
            } else {
              toast.error("Unable to get projects");
            }

            //get client
            let cResponse = await getClients(user?.token);
            if (cResponse.status === "success") {
              setClients(cResponse.data);
            } else {
              toast.error("Unbale to get clients");
            }
          }
        }
      }
      if (!open) {
        setTasksForSelectedDay([]);
      }
    })();
  }, [open]);

  const getTasksForDay = async () => {
    let currentDate = selectedDate.split("T")[0];
    let response = await getTaskByDate(currentDate, user.token);
    if (response.status === "success") {
      if (response.data.length) {
        setTasksForSelectedDay(response?.data);
      }
    }
  };

  const handleAddTask = async (e) => {
    let newTask = getTaskObject();
    setTask(newTask);
    setIsTaskModalVisible(true);
  };

  const handleEditTask = (index) => (e) => {
    let currentTask = tasksForSelectedDay[index];
    setTask(currentTask);
    setIsTaskModalVisible(true);
  };

  const handleSave = async () => {
    let postPaylod = getTaskPostPayload(selectedDate, tasksForSelectedDay);
    let response = await addTimeEntry(postPaylod, user?.token);
    if (response.status === "success") {
      toast.success("Saved successfully.");
      onClose();
    } else {
      toast.error("Unable to save");
    }
  };

  const handleCloseModal = (isGetCallNeeded) => async (e) => {
    if (isGetCallNeeded) {
      await getTasksForDay();
    }
    setIsTaskModalVisible(false);
  };

  const handleDeleteTask = (id) => (e) => {
    setDeleteId(id);
    setAnchorEl(e.currentTarget);
    setIsDeletePopperOpen(true);
  };

  const handleDeletConfirm = async (e) => {
    setIsDeletePopperOpen(false);
    setAnchorEl(null);
    let response = await deleteTask(deleteId, user?.token);
    if (response.status === "success") {
      toast.success("Task deleted successfully.");
    } else {
      toast.error("Unable to delete task.");
    }
  };

  return (
    <>
      <Drawer open={open} onClose={onClose} anchor="right">
        <Box sx={{ width: "96vw" }}>
          <h1 style={{ padding: "10px" }}>
            {dayjs(selectedDate).format("DD/MM/YYYY")}
          </h1>
          <TasksTable
            tasks={tasksForSelectedDay}
            onAdd={handleAddTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          <Button
            variant="contained"
            sx={{
              width: "7rem",
              float: "right",
              marginRight: "2rem",
              marginTop: "2rem",
              padding: "5px",
            }}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              width: "7rem",
              float: "right",
              marginRight: "2rem",
              marginTop: "2rem",
              padding: "5px",
            }}
          >
            Cancel
          </Button>
        </Box>
        <TaskModal
          isModalOpen={isTaskModalVisible}
          closeModal={handleCloseModal}
          task={task}
          user={user}
          clients={clients}
          projects={projects}
          date={selectedDate}
        />
        <DeletePopper
          open={isDeletePopperOpen}
          anchorEl={anchorEl}
          onCancel={() => {
            debugger;
            setAnchorEl(null);
            setIsDeletePopperOpen(false);
          }}
          onConfirm={handleDeletConfirm}
        />
      </Drawer>
    </>
  );
};

export default TasksDrawer;
