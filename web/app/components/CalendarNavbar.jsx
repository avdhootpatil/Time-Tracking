import React from "react";
import dayjs from "dayjs";

const CalendarNavbar = ({
  handleIncrementMonth,
  handleDecrementMonth,
  handleIncrementYear,
  handleDecrementYear,
  selectedMonth,
  selectedYear,
}) => {
  return (
    <>
      <button className="calendar-nav-btns" onClick={handleDecrementYear}>
        {"<<"}
      </button>
      <button className="calendar-nav-btns" onClick={handleDecrementMonth}>
        {"<"}
      </button>
      <button className="calendar-navbar-month calendar-nav-btns">
        {dayjs().month(selectedMonth).format("MMMM")} {selectedYear}
      </button>
      <button className="calendar-nav-btns" onClick={handleIncrementMonth}>
        {">"}
      </button>
      <button className="calendar-nav-btns" onClick={handleIncrementYear}>
        {">>"}
      </button>
    </>
  );
};

export default CalendarNavbar;
