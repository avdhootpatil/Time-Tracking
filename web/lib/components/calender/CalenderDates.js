import React from "react";
import dayjs from "dayjs";

const CalendarDates = ({ handleOpenTasksDrawer, daysOfMonth }) => {
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
              onDoubleClick={handleOpenTasksDrawer}
            >
              {dayjs(day.date).format("D")}
            </div>
          );
        }
      })}
    </>
  );
};

export default CalendarDates;
