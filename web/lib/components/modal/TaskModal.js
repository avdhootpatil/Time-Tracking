import { getTaskObject, getTaskPostPayload } from "@/lib/helperFunctions";
import { saveTask } from "@/lib/services/timesheet";
import { Button } from "@mui/joy";
import { Box } from "@mui/material";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import OutlinedInput from "../OulinedInput";
import Select from "../Select";
import TextField from "../TextField";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

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
    <Transition.Root show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative "
        style={{ zIndex: "1500" }}
        onClose={closeModal(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Task Name
                      </label>
                      <div className="mt-2">
                        <TextField
                          onChange={handleChange("taskName")}
                          value={currentTask?.taskName}
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Estimate Value
                      </label>
                      <div className="mt-2">
                        <OutlinedInput
                          value={currentTask?.estimateValue}
                          onChange={handleChange("estimateValue")}
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Azure Value
                      </label>
                      <div className="mt-2">
                        <OutlinedInput
                          value={currentTask?.azureValue}
                          onChange={handleChange("azureValue")}
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        User story number
                      </label>
                      <div className="mt-2">
                        <OutlinedInput
                          value={currentTask?.userStoryNumber}
                          onChange={handleChange("userStoryNumber")}
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Task number
                      </label>
                      <div className="mt-2">
                        <OutlinedInput
                          value={currentTask?.taskNumber}
                          onChange={handleChange("taskNumber")}
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <Select
                        onSelect={handleChange("client")}
                        value={currentTask?.client}
                        nameProperty="name"
                        valueProperty="id"
                        options={clients}
                        label="Client"
                      />
                    </div>

                    <div className="mt-2">
                      <Select
                        onSelect={handleChange("project")}
                        value={currentTask?.project}
                        nameProperty="name"
                        valueProperty="id"
                        options={projects}
                        label="Project"
                      />
                    </div>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "1",
                        marginTop: "10px",
                      }}
                    >
                      <Button
                        onClick={handleSave}
                        sx={{ marginRight: "10px" }}
                        variant="soft"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={closeModal(false)}
                        variant="soft"
                        color="danger"
                      >
                        Cancel
                      </Button>
                    </Box>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default TaskModal;
