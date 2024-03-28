"use client";

import { Fragment, useEffect, useState } from "react";

import {
  getLeavePostPayload,
  getUserFromLocalStorage,
} from "@/lib/helperFunctions";
import {
  getLeaveById,
  getLeaveTypes,
  requestLeave,
} from "@/lib/services/leave";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Box, Button } from "@mui/joy";
import { produce } from "immer";
import toast from "react-hot-toast";
import DateRangePicker from "../DateRangePicker";
import Select from "../Select";
import TextField from "../TextField";
import { getApprovers } from "@/lib/services/approval";

const LeaveDrawer = ({ open = false, onClose = () => {}, leaveId = 0 }) => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [leave, setLeave] = useState({
    leaveId: 0,
    leaveType: null,
    from: null,
    to: null,
    reason: null,
    approver: null,
    leaveRequestFor: "full-day",
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      if (open) {
        let user = getUserFromLocalStorage();
        setUser(user);
        await getSetLeaveTypes(user?.token);
        await getSetApprovers(user?.token);

        if (leaveId > 0) {
          await getLeave(leaveId, user?.token);
        }
      }
    })();

    return () => {
      setLeave({
        leaveId: 0,
        leaveType: null,
        from: null,
        to: null,
        reason: null,
        approver: null,
        leaveRequestFor: "full-day",
      });
    };
  }, [open]);

  const getLeave = async (leaveId, token) => {
    let response = await getLeaveById(leaveId, token);
    if (response.status === "success") {
      setLeave(response.data);
    } else {
      toast.error("Unable to get leave");
    }
  };

  const getSetLeaveTypes = async (token) => {
    let response = await getLeaveTypes(token);
    if (response.status === "success") {
      setLeaveTypes(response.data);
    } else {
      toast.error("Unable to get leave types");
    }
  };

  const getSetApprovers = async (token) => {
    let response = await getApprovers(token);
    if (response.status === "success") {
      setApprovers(response.data);
    } else {
      toast.error("Unable to get approvers");
    }
  };

  const handleChange = (name) => (event) => {
    let nextState = produce(leave, (draft) => {
      switch (name) {
        case "leaveType":
          draft[name] = event;
          break;

        case "leaveRequestFor":
          draft[name] = event.target.value;
          break;

        case "startDate":
          draft["from"] = event;
          break;

        case "endDate":
          draft["to"] = event;
          break;

        case "reason":
          draft[name] = event.target.value;
          break;

        case "approver":
          draft[name] = event;
          break;

        default:
          break;
      }
    });

    setLeave(nextState);
  };

  const handleSave = async () => {
    let payload = getLeavePostPayload(leave);
    let response = await requestLeave(payload, user?.token);
    if (response.status === "success") {
      onClose(true)(null);
    } else {
      toast.error(response.errors);
    }
  };

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose(false)}>
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
                          onClick={onClose(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <form className="space-y-6" style={{ width: "400px" }}>
                          <div>
                            <div className="mt-2">
                              <Select
                                label="Leave Type"
                                options={leaveTypes}
                                nameProperty="name"
                                valueProperty="id"
                                value={leave.leaveType}
                                onSelect={handleChange("leaveType")}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="mt-2">
                              <div className="flex items-center gap-x-3">
                                <input
                                  id="full-day"
                                  name="leave-day"
                                  type="radio"
                                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                  onChange={handleChange("leaveRequestFor")}
                                  value="full-day"
                                  checked={leave.leaveRequestFor === "full-day"}
                                />
                                <label
                                  htmlFor="full-day"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Full day
                                </label>
                              </div>
                              <div className="flex items-center gap-x-3 my-2">
                                <input
                                  id="half-day"
                                  name="leave-day"
                                  type="radio"
                                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                  onChange={handleChange("leaveRequestFor")}
                                  value="half-day"
                                  checked={leave.leaveRequestFor === "half-day"}
                                />
                                <label
                                  htmlFor="half-day"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Half day
                                </label>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Date
                            </label>
                            <div className="mt-2">
                              <DateRangePicker
                                onChange={handleChange}
                                startDate={leave.from}
                                endDate={leave.to}
                                endDateVisibility={
                                  leave?.leaveRequestFor === "half-day"
                                    ? false
                                    : true
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <div className="mt-2">
                              <TextField
                                label="Reason"
                                onChange={handleChange("reason")}
                                value={leave.reason}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="mt-2">
                              <Select
                                label="Approver"
                                onSelect={handleChange("approver")}
                                options={approvers}
                                nameProperty="name"
                                valueProperty="id"
                                value={leave.approver}
                              />
                            </div>
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
                              sx={{ marginRight: "10px" }}
                              variant="soft"
                              onClick={handleSave}
                            >
                              Save
                            </Button>
                            <Button
                              variant="soft"
                              color="danger"
                              onClick={onClose(false)}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </form>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default LeaveDrawer;
