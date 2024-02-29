"use client";

import {
  getUserFromLocalStorage,
  hourLoggedForMonth,
  updateHoursLogged,
} from "@/lib/helperFunctions";
import { getHoursLogged } from "@/lib/services/timesheet";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import TasksDrawer from "../taskDrawer";
import CalendarDates from "./CalenderDates";
import CalendarNavbar from "./CalenderNavbar";

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      let user = getUserFromLocalStorage();
      setUser(user);
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
        let hours = hourLoggedForMonth(hReponse.data);
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
            let date = dayjs(`${selectedYear}-${i + 1}-${j + 1}`).format(
              "YYYY-MM-DD"
            );

            tempDatesOfEachMonth.push({
              id: crypto.randomUUID(),
              date: date,
              isDayVisible: true,
              hoursLogged: hours[date] || 0,
            });
          }
          tempDaysOfMonth.push(tempDatesOfEachMonth);
        }
        setDaysOfMonth(tempDaysOfMonth);
      }
    })();
  }, [selectedYear]);

  const handleIncrementMonth = async () => {
    let tempSelectedMonth = selectedMonth;
    if (tempSelectedMonth < 11) tempSelectedMonth++;
    else {
      tempSelectedMonth = 0;
      setSelectedYear((prev) => prev + 1);
    }
    setSelectedMonth(tempSelectedMonth);

    await getSetLoggedHours(tempSelectedMonth, selectedYear, user?.token);
  };

  const handleDecrementMonth = async () => {
    let tempSelectedMonth = selectedMonth;
    if (tempSelectedMonth > 0) tempSelectedMonth--;
    else {
      tempSelectedMonth = 11;
      setSelectedYear((prev) => prev - 1);
    }
    setSelectedMonth(tempSelectedMonth);

    await getSetLoggedHours(tempSelectedMonth, selectedYear, user?.token);
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

  const handleClose = async () => {
    setOpenTasksDrawer(false);

    await getSetLoggedHours(selectedMonth, selectedYear, user?.token);
  };

  const getSetLoggedHours = async (selectedMonth, selectedYear, token) => {
    let response = await getHoursLogged(selectedMonth + 1, selectedYear, token);

    if (response.status === "success") {
      let hours = hourLoggedForMonth(response.data);
      setHourLogged(hours);
      let monthDays = updateHoursLogged(selectedMonth, daysOfMonth, hours);
      setDaysOfMonth(monthDays);
    }
  };

  return (
    <Box sx={{ height: "100%" }}>
      <CalendarNavbar
        handleIncrementMonth={handleIncrementMonth}
        handleDecrementMonth={handleDecrementMonth}
        handleIncrementYear={handleIncrementYear}
        handleDecrementYear={handleDecrementYear}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
      <Box sx={{ display: "flex", justifyContent: "center", height: "100%" }}>
        <div className="calendar-grid">
          {daysInWeek?.map((val, index) => (
            <div
              key={val}
              className={`flex flex-row justify-center border-solid border border-grey-500 px-3 py-3 font-medium`}
            >
              {val}
            </div>
          ))}

          <CalendarDates
            onTaskDrawerOpen={handleOpenTasksDrawer}
            daysOfMonth={daysOfMonth[selectedMonth]}
            todaysDate={todaysDate}
          />
        </div>
      </Box>
      <TasksDrawer
        open={openTasksDrawer}
        onClose={handleClose}
        selectedDate={selectedDate}
      />
    </Box>
  );
};

export default Calendar;
