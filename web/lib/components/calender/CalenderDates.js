import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Chip } from "@mui/material";
import { hoursChipType } from "@/lib/helperFunctions";

const CalendarDates = ({
  onTaskDrawerOpen = () => {},
  daysOfMonth = [],
  todaysDate = "",
}) => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    (() => {
      if (todaysDate) {
        setCurrentDate(todaysDate.split("T")[0]);
      }
    })();
  }, [todaysDate]);

  if (currentDate.length) {
    return (
      <>
        {daysOfMonth?.map((day) => {
          if (!day.isDayVisible) return <div key={crypto.randomUUID()}></div>;
          else {
            return (
              <div
                key={crypto.randomUUID()}
                className="calendar-cell"
                id={day.date}
                onDoubleClick={onTaskDrawerOpen(day.date)}
                style={
                  day.date === currentDate
                    ? { backgroundColor: "lightGrey" }
                    : null
                }
              >
                {dayjs(day.date).format("D")}
                <div></div>
                <Chip
                  label={`Hours Logged : ${day.hoursLogged}`}
                  color={hoursChipType(day.hoursLogged)}
                  size="medium"
                />
              </div>
            );
          }
        })}
      </>
    );
  }
};

export default CalendarDates;
