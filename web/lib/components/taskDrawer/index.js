"use client";

import { getTaskObject, getUserFromLocalStorage } from "@/lib/helperFunctions";
import { getClients } from "@/lib/services/client";
import { getProjects } from "@/lib/services/project";
import { deleteTask, getTaskByDate } from "@/lib/services/timesheet";
import { Button } from "@mui/joy";
import dayjs from "dayjs";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeleteConfirmDialog from "../deleteConfirmDialog";
import { TaskModal } from "../modal";
import { TasksTable } from "../table";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

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
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative max-w-7xl	">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4 ">
                        <button
                          type="button"
                          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={onClose}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          {`Tasks : ${dayjs(selectedDate).format(
                            "DD/MM/YYYY"
                          )} `}
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <TasksTable
                          tasks={tasksForSelectedDay}
                          onAdd={handleAddTask}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                        />

                        <Button
                          onClick={onClose}
                          variant="soft"
                          sx={{
                            width: "7rem",
                            float: "right",
                            marginTop: "2rem",
                            padding: "5px",
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

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
    </>
  );
};

export default TasksDrawer;
