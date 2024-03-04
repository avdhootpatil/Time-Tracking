"use client";

import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import { getClients } from "@/lib/services/client";
import { getProjectById, saveProject } from "@/lib/services/project";
import { projectSchema } from "@/lib/validation";
import { Button } from "@mui/joy";
import { Box } from "@mui/material";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import OutlinedInput from "../OulinedInput";
import Select from "@/lib/components/select";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";

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

  const cancelButtonRef = useRef(null);

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
    <Transition.Root show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => onCancel(false)}
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
                        Project Name
                      </label>
                      <div className="mt-2">
                        <OutlinedInput
                          onChange={handleChange("name")}
                          value={project?.name || ""}
                          isError={errors.name && errors.name.length}
                          placeholder="Project Name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Description
                      </label>
                      <div className="mt-2">
                        <OutlinedInput
                          onChange={handleChange("description")}
                          value={project?.description || ""}
                          isError={
                            errors.description && errors.description.length
                          }
                          placeholder="Description"
                        />
                      </div>
                    </div>

                    <div>
                      <Select
                        label="Client"
                        valueProperty="id"
                        nameProperty="name"
                        placeholder="Select Client"
                        sx={{ margin: "0px !important" }}
                        options={clients}
                        onSelect={handleChange("client")}
                        value={project?.client || null}
                        isError={errors.client && errors.client.length}
                      />
                    </div>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "1",
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
                        onClick={() => {
                          closeModal(false);
                          clearFields();
                        }}
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

export default ProjectModal;
