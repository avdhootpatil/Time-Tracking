"use client";

import { Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import "./index.css";

export default function StyledButton({
  label = "",
  onClick = null,
  disabled = false,
  size = "small",
  sx = null,
  isLoading = false,
  isApiCallInvolved = false,
}) {
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleDebouncedApiCall = () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    setDebounceTimeout(
      setTimeout(() => {
        onClick();
      }, 1000)
    );
  };

  const handleClick = () => {
    if (isApiCallInvolved) {
      handleDebouncedApiCall();
    } else {
      onClick();
    }
  };

  return (
    <Button
      variant="outlined"
      onClick={handleClick}
      disabled={isLoading || disabled}
      size={size}
      className="styled-btn"
      sx={{ position: "relative", ...sx }}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : label}
    </Button>
  );
}
