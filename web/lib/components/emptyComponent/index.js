import React from "react";

export default function EmptyComponent() {
  return (
    <div
      style={{
        height: "50px",
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      <span style={{ color: "#ccc" }}>No Data</span>
    </div>
  );
}
