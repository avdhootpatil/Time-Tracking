import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Button } from "@mui/joy";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const CalendarNavbar = ({
  handleIncrementMonth,
  handleDecrementMonth,
  handleIncrementYear,
  handleDecrementYear,
  selectedMonth,
  selectedYear,
}) => {
  const [currentMonth, setcurrentMonth] = useState(
    dayjs().month(selectedMonth).format("MMMM")
  );

  useEffect(() => {
    setcurrentMonth(dayjs().month(selectedMonth).format("MMMM"));
  }, [selectedMonth]);

  return (
    <div className="w-full	flex flex-row justify-between items-center border-solid border border-grey-500 border-b-0 px-5 py-1 rounded-tl-xl rounded-tr-xl">
      <div className="decoration-1	my-3 text-lg font-bold ">
        {currentMonth} {selectedYear}
      </div>
      <div>
        <Button
          onClick={handleDecrementYear}
          endDecorator={<KeyboardDoubleArrowLeftIcon />}
          variant="plain"
          sx={{ borderRadius: "none" }}
          size="sm"
          className="mx-5"
        />

        <Button
          onClick={handleDecrementMonth}
          endDecorator={<KeyboardArrowLeftIcon />}
          variant="plain"
          size="sm"
        />

        <Button
          onClick={handleIncrementMonth}
          endDecorator={<KeyboardArrowRightIcon />}
          variant="plain"
          size="sm"
        />

        <Button
          onClick={handleIncrementYear}
          endDecorator={<KeyboardDoubleArrowRightIcon />}
          variant="plain"
          size="sm"
        />
      </div>
    </div>
  );
};

export default CalendarNavbar;
