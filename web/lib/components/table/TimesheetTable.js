import { StyledTableCell, StyledTableRow } from "@/lib/styles/tableStyles";

import dayjs from "dayjs";
import EmptyComponent from "../emptyComponent";
import { Table } from "@mui/joy";

const TimesheetTable = ({ tasks = [] }) => {
  return (
    <div className="border border-solid border-grey-500">
      <Table borderAxis="both" size="md">
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Project</th>
            <th>User Story No.</th>
            <th>Task No.</th>
            <th>Task Name</th>
            <th>Estimate</th>
            <th>Azure Value</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.taskId}>
              <td sx={{ width: "20%" }}>
                {dayjs(task?.date).format("DD/MM/YYYY")}
              </td>
              <td sx={{ width: "120px" }}>{task?.clientName}</td>
              <td sx={{ width: "120px" }}>{task?.projectName}</td>
              <td sx={{ width: "120px" }}>{task?.userStoryNumber}</td>
              <td sx={{ width: "120px" }}>{task?.taskNumber}</td>
              <td>{task?.taskName}</td>
              <td>{task?.estimateValue}</td>
              <td>{task?.azureValue}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {!tasks.length ? <EmptyComponent /> : null}
    </div>
  );
};

export default TimesheetTable;
