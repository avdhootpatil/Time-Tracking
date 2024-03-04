"use client";

import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import saveHoliday from "@/lib/services/holidays/saveHoliday";
import holidaySchema from "@/lib/validation/holidaySchema";
import { Button } from "@mui/joy";
import { Box, Modal } from "@mui/material";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { modalStyle } from "../../styles/modalStyles";
import OutlinedInput from "../OulinedInput";
import PickerWithJoyField from "../datePicker";
import { getHolidayById } from "@/lib/services/holidays";
import dayjs from "dayjs";

const HolidayModal = ({
  isModalOpen = false,
  closeModal = () => {},
  selectedYear = "",
  holidayId = 0,
}) => {
  const [holiday, setHoliday] = useState({
    holidayId: 0,
    date: null,
    description: "",
  });
  const user = getUserFromLocalStorage();
  const [errors, setErrors] = useState({});

  const SCHEMA = holidaySchema();

  useEffect(() => {
    const fetchData = async () => {
      if (holidayId > 0) {
        let response = await getHolidayById(holidayId, user.token);

        if (response.status === "success") {
          setHoliday(response.data);
        } else {
          if (response.status === "unauthorized") {
            toast.error(response.errors);
          } else {
            toast.error("Unable to get holiday");
          }
        }
      }
    };

    fetchData();
  }, [holidayId]);

  const clearFields = () => {
    setHoliday({
      holidayId: 0,
      date: null,
      description: "",
    });
    setErrors({});
  };

  const handleChange = (name) => (event) => {
    let nextErrors = { ...errors };
    let nextState = produce(holiday, (draft) => {
      switch (name) {
        case "date":
          draft[name] = event;
          break;
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
    setHoliday(nextState);
    setErrors(nextErrors);
  };

  const handleSave = async () => {
    try {
      SCHEMA.validateSync(holiday, { abortEarly: false });
      let response = await saveHoliday(
        holiday?.holidayId || 0,
        {
          holidayId: holiday?.holidayId,
          date: holiday?.date,
          description: holiday?.description,
          year: selectedYear,
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
        noValidate
        autoComplete="off"
        className="container-margin"
      >
        <>
          <div>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Date
                </label>
                <div className="mt-2">
                  <PickerWithJoyField
                    sx={{ width: "100%" }}
                    onChange={handleChange("date")}
                    value={holiday?.date ? dayjs(holiday?.date) : null || null}
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
                    value={holiday?.description || ""}
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

export default HolidayModal;
