"use client";

import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import { getHolidayById } from "@/lib/services/holidays";
import saveHoliday from "@/lib/services/holidays/saveHoliday";
import holidaySchema from "@/lib/validation/holidaySchema";
import { Button } from "@mui/joy";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import OutlinedInput from "../OulinedInput";
import PickerWithJoyField from "../datePicker";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

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
          let d = new Date(event);
          var newd = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
          let date = newd?.toISOString();

          draft[name] = date;
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
        if (response.status === "serverError") {
          toast.error(response.errors[0]);
        } else {
          toast.error("Unable to save");
        }
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
                        Date
                      </label>
                      <div className="mt-2">
                        <PickerWithJoyField
                          sx={{ width: "100%" }}
                          onChange={handleChange("date")}
                          value={holiday?.date ? dayjs(holiday?.date) : null}
                          isError={
                            errors.date && errors.date.length ? true : false
                          }
                          placeholder="Project Name"
                          minDate={null}
                          maxDate={null}
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

export default HolidayModal;
