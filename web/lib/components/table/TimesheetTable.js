import { StyledTableCell, StyledTableRow } from "@/lib/styles/tableStyles";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import EmptyComponent from "../emptyComponent";

const TimesheetTable = ({ tasks = [] }) => {
  return (
    <>
      <TableContainer
        sx={{
          borderRadius: "5px",
          backgroundColor: "white",
          borderBottom: "1px solid #ccc",
          borderLeft: "1px solid #ccc",
          borderRight: "1px solid #ccc",
          marginTop: "20px",
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Client</StyledTableCell>
              <StyledTableCell>Project</StyledTableCell>
              <StyledTableCell>User Story No.</StyledTableCell>
              <StyledTableCell>Task No.</StyledTableCell>
              <StyledTableCell>Task Name</StyledTableCell>
              <StyledTableCell>Estimate</StyledTableCell>
              <StyledTableCell>Azure Value</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <StyledTableRow key={task.taskId}>
                <StyledTableCell sx={{ width: "20%" }}>
                  {dayjs(task?.date).format("DD/MM/YYYY")}
                </StyledTableCell>
                <StyledTableCell sx={{ width: "120px" }}>
                  {task?.clientName}
                </StyledTableCell>
                <StyledTableCell sx={{ width: "120px" }}>
                  {task?.projectName}
                </StyledTableCell>
                <StyledTableCell sx={{ width: "120px" }}>
                  {task?.userStoryNumber}
                </StyledTableCell>
                <StyledTableCell sx={{ width: "120px" }}>
                  {task?.taskNumber}
                </StyledTableCell>
                <StyledTableCell>{task?.taskName}</StyledTableCell>
                <StyledTableCell>{task?.estimateValue}</StyledTableCell>
                <StyledTableCell>{task?.azureValue}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        {!tasks.length ? <EmptyComponent /> : null}
      </TableContainer>
    </>
  );
};

export default TimesheetTable;
