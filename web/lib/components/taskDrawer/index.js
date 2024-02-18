"use client";

import { getTaskObject, getUserFromLocalStorage } from "@/lib/helperFunctions";
import { getClients } from "@/lib/services/client";
import { getProjects } from "@/lib/services/project";
import { deleteTask, getTaskByDate } from "@/lib/services/timesheet";
import { Box, Button, Drawer } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeleteConfirmDialog from "../deleteConfirmDialog";
import { TaskModal } from "../modal";
import { TasksTable } from "../table";

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
  const [isDeletePopperOpen, setIsDeletePopperOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const handleCloseModal = (isGetCallNeeded) => async (e) => {
    if (isGetCallNeeded) {
      await getTasksForDay();
    }
    setIsTaskModalVisible(false);
  };

  const handleDeleteTask = (index) => (e) => {
    setCurrentIndex(index);
    setIsDeletePopperOpen(true);
  };

  const handleDeletConfirm = (index) => async (e) => {
    let deleteId = tasksForSelectedDay[index]["taskId"];
    let response = await deleteTask(deleteId, user?.token);
    if (response.status === "success") {
      toast.success("Task deleted successfully.");
      await getTasksForDay();
    } else {
      toast.error("Unable to delete task.");
    }

    setIsDeletePopperOpen(false);
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
        <DeleteConfirmDialog
          open={isDeletePopperOpen}
          onCancel={setIsDeletePopperOpen}
          onConfirm={handleDeletConfirm}
          currentIndex={currentIndex}
        />
      </Drawer>
    </>
  );
};

export default TasksDrawer;
