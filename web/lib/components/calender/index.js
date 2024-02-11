"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import TasksDrawer from "../taskDrawer";
import CalendarDates from "./CalenderDates";
import CalendarNavbar from "./CalenderNavbar";
import { getHoursLogged } from "@/lib/services/timesheet";
import { getUserFromLocalStorage } from "@/lib/helperFunctions";

const Calendar = () => {
  const tempCurrentMonth = dayjs().month();

  const [daysInEachMonth, setDaysInEachMonth] = useState([]);
  const [daysInWeek, setDaysInWeek] = useState([]);
  const [firstDayOfMonth, setFirstDayOfMonth] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(tempCurrentMonth);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedDate, setSelectedDate] = useState(0);
  const [openTasksDrawer, setOpenTasksDrawer] = useState(false);
  const [daysOfMonth, setDaysOfMonth] = useState([]);
  const [todaysDate, setTodaysDate] = useState(new Date().toISOString());
  const [hourLogged, setHourLogged] = useState(null);

  useEffect(() => {
    (async () => {
      let user = getUserFromLocalStorage();
      let tempDaysInMonth = [];

      for (let i = 0; i < 12; i++) {
        tempDaysInMonth.push(
          dayjs(`${selectedYear}-${i + 1}-01`).daysInMonth()
        );
      }
      setDaysInWeek("Sun Mon Tue Wed Thu Fri Sat".split(" "));

      let tempFirstDayOfMonth = [];

      tempDaysInMonth.map((day, index) => {
        let date = dayjs(`${index + 1}-01-${selectedYear}`).format("d");
        tempFirstDayOfMonth.push(date);
        setFirstDayOfMonth(tempFirstDayOfMonth);
      });

      setDaysInEachMonth(tempDaysInMonth);

      let hReponse = await getHoursLogged(
        selectedMonth + 1,
        selectedYear,
        user?.token
      );
      if (hReponse.status === "success") {
        let hours = hReponse.data;
        setHourLogged(hours);

        let tempDaysOfMonth = [];

        for (let i = 0; i < 12; i++) {
          let tempDatesOfEachMonth = [];
          for (let k = 0; k < tempFirstDayOfMonth[i]; k++) {
            tempDatesOfEachMonth.push({
              id: crypto.randomUUID(),
              date: "",
              isDayVisible: false,
              hoursLogged: 0,
            });
          }

          for (let j = 0; j < tempDaysInMonth[i]; j++) {
            tempDatesOfEachMonth.push({
              id: crypto.randomUUID(),
              date: dayjs(`${selectedYear}-${i + 1}-${j + 1}`).format(
                "YYYY-MM-DD"
              ),
              isDayVisible: true,
              hoursLogged: 7,
            });
          }
          tempDaysOfMonth.push(tempDatesOfEachMonth);
        }

        setDaysOfMonth(tempDaysOfMonth);
      }
    })();
  }, [selectedYear]);

  const handleIncrementMonth = () => {
    let tempSelectedMonth = selectedMonth;
    if (tempSelectedMonth < 11) tempSelectedMonth++;
    else {
      tempSelectedMonth = 0;
      setSelectedYear((prev) => prev + 1);
    }
    setSelectedMonth(tempSelectedMonth);
  };

  const handleDecrementMonth = () => {
    let tempSelectedMonth = selectedMonth;
    if (tempSelectedMonth > 0) tempSelectedMonth--;
    else {
      tempSelectedMonth = 11;
      setSelectedYear((prev) => prev - 1);
    }
    setSelectedMonth(tempSelectedMonth);
  };

  const handleIncrementYear = () => {
    setSelectedYear((prev) => prev + 1);
  };

  const handleDecrementYear = () => {
    setSelectedYear((prev) => prev - 1);
  };

  const handleOpenTasksDrawer = (date) => (e) => {
    let date = e.target.id;
    if (date.length) {
      let d = new Date(date);
      var newd = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
      let currentDate = newd.toISOString();
      setSelectedDate(currentDate);
      setOpenTasksDrawer(true);
    }
  };

  const handleClose = () => {
    setOpenTasksDrawer(false);
  };

  console.log(daysInEachMonth);
  console.log(daysOfMonth);

  return (
    <>
      <div className="calendar-grid">
        <CalendarNavbar
          handleIncrementMonth={handleIncrementMonth}
          handleDecrementMonth={handleDecrementMonth}
          handleIncrementYear={handleIncrementYear}
          handleDecrementYear={handleDecrementYear}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
        {daysInWeek?.map((val) => (
          <div key={val} className="calendar-day-cell">
            {val}
          </div>
        ))}

        <CalendarDates
          onTaskDrawerOpen={handleOpenTasksDrawer}
          daysOfMonth={daysOfMonth[selectedMonth]}
          todaysDate={todaysDate}
        />
      </div>
      <TasksDrawer
        open={openTasksDrawer}
        onClose={handleClose}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default Calendar;
