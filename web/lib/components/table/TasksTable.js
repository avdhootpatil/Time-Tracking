import { StyledTableCell, StyledTableRow } from "@/lib/styles/tableStyles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EmptyComponent from "../emptyComponent";
import { Button, Table } from "@mui/joy";

const TasksTable = ({
  tasks = [],
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  return (
    <div className="border border-solid border-grey-500">
      <Table borderAxis="both" size="sm">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Estimate Value</th>
            <th>Azure Value</th>
            <th>User Story No.</th>
            <th>Task No.</th>
            <th>Client</th>
            <th>Project</th>

            <th>
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
          {tasks.map((task, index) => (
            <tr key={task.taskId}>
              <td sx={{ width: "20%" }}>{task?.taskName}</td>
              <td sx={{ width: "120px" }}>{task?.estimateValue}</td>
              <td sx={{ width: "120px" }}>{task?.azureValue}</td>
              <td sx={{ width: "120px" }}>{task?.userStoryNumber}</td>
              <td sx={{ width: "120px" }}>{task?.taskNumber}</td>
              <td>{task?.client?.name}</td>
              <td>{task?.project?.name}</td>

              <td>
                <div className="flex flex-row justify-end">
                  <Button
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={onEdit(index)}
                    sx={{ marginRight: "10px" }}
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
      {!tasks.length ? <EmptyComponent /> : null}
    </div>
  );
};

export default TasksTable;
