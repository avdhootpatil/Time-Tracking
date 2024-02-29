"use client";

import { FormControl, FormHelperText } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { produce } from "immer";
import { useEffect, useState } from "react";
import PickerWithJoyField from "../datePicker";
import "./index.css";

export default function DateRangePicker({
  onChange = null,
  startDateLabel = "",
  endDateLabel = "",
  endDateVisibility = true,
  startDate = null,
  endDate = null,
  isStartDateRequired = false,
  isEndDateRequired = false,
  isStartDateError = false,
  isEndDateError = false,
  sx = null,
}) {
  const [dates, setDates] = useState({ startDate: null, endDate: null });

  useEffect(() => {
    (() => {
      setDates({
        startDate: startDate,
        endDate: endDate,
      });
    })();
  }, [startDate, endDate]);

  const handleChange = (name) => (e) => {
    let nextState = produce(dates, (draft) => {
      if (e) {
        var d = new Date(e);
        var newd = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
        draft[name] = newd.toISOString();
      } else {
        draft[name] = e;
      }
    });
    setDates(nextState);
    if (onChange !== null) {
      onChange(name)(nextState[name]);
    }
  };

  return (
    <div>
      <FormControl
        sx={
          endDateVisibility
            ? {
                width: `49% `,
                marginRight: "1%",
                ...sx,
              }
            : {
                width: `96% `,
                marginLeft: "3%",
                ...sx,
              }
        }
        className="form-row-margin-bottom"
        size="small"
      >
        <FormHelperText
          sx={
            endDateVisibility
              ? {
                  marginLeft: "0px",
                  marginBottom: ` 3px `,
                }
              : {
                  marginLeft: "0px",
                  marginBottom: `0px`,
                }
          }
          className={isStartDateRequired ? "required" : ""}
        >
          {startDateLabel}
        </FormHelperText>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <PickerWithJoyField
            value={dates?.startDate !== null ? dayjs(dates?.startDate) : null}
            onChange={handleChange("startDate")}
            maxDate={dates?.endDate !== null ? dayjs(dates?.endDate) : null}
          />
        </LocalizationProvider>
      </FormControl>
      {endDateVisibility === true ? (
        <FormControl variant="outlined" sx={{ width: "49%" }}>
          <FormHelperText
            sx={{ marginLeft: "0px", marginBottom: "3px" }}
            className={isEndDateRequired ? "required" : ""}
          >
            {endDateLabel}
          </FormHelperText>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <PickerWithJoyField
              value={dates?.endDate !== null ? dayjs(dates?.endDate) : null}
              onChange={handleChange("endDate")}
              minDate={
                dates?.startDate !== null ? dayjs(dates?.startDate) : null
              }
            />
          </LocalizationProvider>
        </FormControl>
      ) : (
        <div></div>
      )}
    </div>
  );
}
