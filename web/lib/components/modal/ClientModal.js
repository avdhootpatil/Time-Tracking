import { getClientById, saveClient } from "@/lib/services/client";
import { Box, FormControl, Modal, OutlinedInput } from "@mui/material";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { modalStyle } from "../../styles/modalStyles";
import StyledButton from "../styledButton";
import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import { clientSchema } from "@/lib/validation";
import * as yup from "yup";

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

  const handleSave = async () => {
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
                value={client?.name || ""}
                error={errors.name && errors.name.length}
                placeholder="Client Name"
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
                value={client?.description || ""}
                error={errors.description && errors.description.length}
                placeholder="Description"
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

export default ClientModal;
