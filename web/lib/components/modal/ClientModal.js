import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import { getClientById, saveClient } from "@/lib/services/client";
import { clientSchema } from "@/lib/validation";
import { Button } from "@mui/joy";
import { Box } from "@mui/material";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import OutlinedInput from "../OulinedInput";
import TextField from "../TextField";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";

const ClientModal = ({
  isModalOpen = false,
  closeModal = () => {},
  clientId = 0,
}) => {
  const [client, setClient] = useState({
    id: 0,
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);

  const cancelButtonRef = useRef(null);

  const SCHEMA = clientSchema();

  useEffect(() => {
    (async () => {
      let user = getUserFromLocalStorage();
      if (user) {
        setUser(user);

        if (clientId === 0) return;

        let response = await getClientById(clientId, user.token);

        if (response.status === "success") {
          setClient(response.data);
        } else {
          if (response.status === "unauthorized") {
            toast.error(response.errors);
          } else {
            toast.error("Unable to get client");
          }
        }
      }
    })();
  }, [clientId]);

  const clearFields = () => {
    setClient({
      id: 0,
      name: "",
      description: "",
    });
    setErrors({});
  };

  const handleChange = (name) => (event) => {
    let nextErrors = { ...errors };
    let nextState = produce(client, (draft) => {
      switch (name) {
        case "name":
        case "description":
          draft[name] = event.target.value;
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
    setClient(nextState);
    setErrors(nextErrors);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      SCHEMA.validateSync(client, { abortEarly: false });
      let response = await saveClient(
        client?.id || 0,
        {
          id: client?.id,
          name: client?.name,
          description: client?.description,
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
                        Client Name
                      </label>
                      <div className="mt-2">
                        <OutlinedInput
                          onChange={handleChange("name")}
                          value={client?.name || ""}
                          isError={errors.name && errors.name.length}
                          placeholder="Client Name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Description
                      </label>
                      <div className="mt-2">
                        <TextField
                          onChange={handleChange("description")}
                          value={client?.description || ""}
                          isError={
                            errors.description && errors.description.length
                          }
                          placeholder="Description"
                        />
                      </div>
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

export default ClientModal;
