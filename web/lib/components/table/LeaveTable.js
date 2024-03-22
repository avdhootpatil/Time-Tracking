"use client";

import AddIcon from "@mui/icons-material/Add";
import { Button, Chip, Table } from "@mui/joy";
import dayjs from "dayjs";
import EmptyComponent from "../emptyComponent";
import TableLoader from "../tableLoader";
import React from "react";
import { getLeaveTypeColour } from "@/lib/helperFunctions";

function LeaveTable({
  leaves = [],
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
  isLoading = false,
}) {
  return (
    <div className="border border-solid border-grey-500">
      <Table borderAxis="both">
        <thead>
          <tr>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Days</th>
            <th>ApprovalStatus</th>

            <th style={{ width: "12%" }}>
              <div className="flex flex-row justify-end px-2">
                <Button
                  size="sm"
                  variant="soft"
                  color="neutral"
                  onClick={onAdd}
                  endDecorator={<AddIcon />}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave, index) => (
            <tr key={leave.leaveId}>
              <td>
                <Chip
                  variant="soft"
                  color={getLeaveTypeColour(leave.leaveTypeName)}
                >
                  {leave.leaveTypeName}
                </Chip>
              </td>
              <td>{dayjs(leave.from).format("DD/MM/YYYY")}</td>
              <td>{dayjs(leave.to).format("DD/MM/YYYY")}</td>
              <td>{leave.numberOfDays}</td>
              <td>{leave.approvalStatusName}</td>

              <td>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={onEdit(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="soft"
                    color="danger"
                    onClick={onDelete(index)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {isLoading ? <TableLoader /> : !leaves.length ? <EmptyComponent /> : null}
    </div>
  );
}

export default React.memo(LeaveTable);
