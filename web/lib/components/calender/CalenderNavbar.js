import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Box, Button, Typography } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

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
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "40px",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        {currentMonth} {selectedYear}
      </Typography>
      <Box>
        <Button onClick={handleDecrementYear} variant="outlined">
          <KeyboardDoubleArrowLeftIcon />
        </Button>
        <Button onClick={handleDecrementMonth} variant="outlined">
          <KeyboardArrowLeftIcon />
        </Button>
        <Button onClick={handleIncrementMonth} variant="outlined">
          <KeyboardArrowRightIcon />
        </Button>
        <Button onClick={handleIncrementYear} variant="outlined">
          <KeyboardDoubleArrowRightIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default CalendarNavbar;
