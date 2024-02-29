import { hoursChipType } from "@/lib/helperFunctions";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import HoursLogged from "../hoursLogged";

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
          if (!day.isDayVisible)
            return (
              <div
                key={crypto.randomUUID()}
                className="border-solid border border-grey-500 px-4 py-4 bg-gray-100"
              ></div>
            );
          else {
            return (
              <div
                key={crypto.randomUUID()}
                className={`${
                  day.date === currentDate
                    ? `calender-cell bg-gray-100 px-5 py-5 text-xs cursor-pointer hover:bg-sky-100`
                    : `calender-cell border-solid border border-grey-500 px-5 py-5 text-xs cursor-pointer hover:bg-sky-100`
                }`}
                id={day.date}
                onDoubleClick={onTaskDrawerOpen(day.date)}
              >
                {dayjs(day.date).format("D")}
                <div></div>

                <HoursLogged hours={day.hoursLogged} />
              </div>
            );
          }
        })}
      </>
    );
  }
};

export default CalendarDates;
