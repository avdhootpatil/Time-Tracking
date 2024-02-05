"use client";

import React, { useEffect, useState } from "react";
import CalendarNavbar from "./CalendarNavbar";
import TasksDrawer from "./TasksDrawer";
import CalendarDates from "./CalendarDates";
const Calendar = () => {
  const dayjs = require("dayjs");
  const [daysInEachMonth, setDaysInEachMonth] = useState([]);
  const [daysInWeek, setDaysInWeek] = useState([]);
  const [firstDayOfMonth, setFirstDayOfMonth] = useState([]);
  let tempCurrentMonth = dayjs().month();
  const [selectedMonth, setSelectedMonth] = useState(tempCurrentMonth);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedDate, setSelectedDate] = useState(0);
  const [openTasksDrawer, setOpenTasksDrawer] = useState(false);
  const [daysOfMonth, setDaysOfMonth] = useState([]);

  // daysOfMonth = [
  //   {
  //     id: 1,
  //     date: "2024-01-17",
  //     isDayVisivble: false,
  //   },
  // ];

  useEffect(() => {
    let tempDaysInMonth = [];
    for (let i = 0; i < 12; i++) {
      tempDaysInMonth.push(dayjs(`${selectedYear}-${i + 1}-01`).daysInMonth());
    }
    setDaysInWeek("Sun Mon Tue Wed Thu Fri Sat".split(" "));

    let tempFirstDayOfMonth = [];

    tempDaysInMonth.map((day, index) => {
      let date = dayjs(`${index + 1}-01-${selectedYear}`).format("d");
      tempFirstDayOfMonth.push(date);
      setFirstDayOfMonth(tempFirstDayOfMonth);
    });
    setDaysInEachMonth(tempDaysInMonth);
    // console.log(tempFirstDayOfMonth);
    // debugger;
    let tempDaysOfMonth = [];
    for (let i = 0; i < 12; i++) {
      let tempDatesOfEachMonth = [];
      for (let k = 0; k < tempFirstDayOfMonth[i]; k++) {
        tempDatesOfEachMonth.push({
          id: crypto.randomUUID(),
          date: "",
          isDayVisible: false,
        });
      }
      for (let j = 0; j < tempDaysInMonth[i]; j++) {
        tempDatesOfEachMonth.push({
          id: crypto.randomUUID(),
          date: dayjs(`${selectedYear}-${i + 1}-${j + 1}`).format("YYYY-MM-DD"),
          isDayVisible: true,
        });
      }
      tempDaysOfMonth.push(tempDatesOfEachMonth);
    }
    // console.log(tempDaysOfMonth);
    setDaysOfMonth(tempDaysOfMonth);
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

  const handleOpenTasksDrawer = (e) => {
    //open drawer from right side
    setOpenTasksDrawer(true);
    // console.log(e.target.id);
    let tempDate = dayjs(e.target.id).format();
    // console.log(tempDate);
    setSelectedDate(tempDate);
  };

  const handleClose = () => {
    setOpenTasksDrawer(false);
  };

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
          handleOpenTasksDrawer={handleOpenTasksDrawer}
          daysOfMonth={daysOfMonth[selectedMonth]}
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
