import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import React from "react";

export default function StyledIconButton({
  onClick = null,
  icon = <AddIcon />,
  disabled = false,
  size = "small",
  sx = null,
  ariaLabel = "",
}) {
  return (
    <Button
      sx={{
        padding: "0px",
        width: "20px !important",
        height: "20px",
        color: "#FFF",
        ...sx,
      }}
      onClick={onClick}
      disabled={disabled}
      size={size}
      aria-label={ariaLabel}
    >
      {icon}
    </Button>
  );
}
