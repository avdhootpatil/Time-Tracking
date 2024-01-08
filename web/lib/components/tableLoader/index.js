import { CircularProgress } from "@mui/material";
import React from "react";

export default function TableLoader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "20px",
      }}
    >
      <CircularProgress />
    </div>
  );
}
