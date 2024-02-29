import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import { getClientById, saveClient } from "@/lib/services/client";
import { clientSchema } from "@/lib/validation";
import { Button } from "@mui/joy";
import { Box, Modal } from "@mui/material";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { modalStyle } from "../../styles/modalStyles";
import OutlinedInput from "../OulinedInput";
import TextField from "../TextField";

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
    debugger;
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
    <Modal open={isModalOpen}>
      <Box
        sx={{
          ...modalStyle,
          "& .MuiTextField-root": { m: 0 },
          width: 600,
          maxWidth: 1000,
          padding: "30px",
        }}
        autoComplete="off"
      >
        <>
          <div>
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
                    isError={errors.description && errors.description.length}
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
        </>
      </Box>
    </Modal>
  );
};

export default ClientModal;
