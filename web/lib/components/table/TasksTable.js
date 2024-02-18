import { StyledTableCell, StyledTableRow } from "@/lib/styles/tableStyles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EmptyComponent from "../emptyComponent";

const TasksTable = ({
  tasks = [],
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  return (
    <>
      <TableContainer
        sx={{ minHeight: "80vh", borderBottom: "1px solid lightGrey" }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>Task Name</StyledTableCell>
              <StyledTableCell>Estimate Value</StyledTableCell>
              <StyledTableCell>Azure Value</StyledTableCell>
              <StyledTableCell>User Story No.</StyledTableCell>
              <StyledTableCell>Task No.</StyledTableCell>
              <StyledTableCell>Client</StyledTableCell>
              <StyledTableCell>Project</StyledTableCell>

              <StyledTableCell></StyledTableCell>
              <StyledTableCell>
                <IconButton onClick={onAdd}>
                  <AddIcon sx={{ color: "white" }} />
                </IconButton>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <StyledTableRow key={task.taskId}>
                <StyledTableCell sx={{ width: "20%" }}>
                  {task?.taskName}
                </StyledTableCell>
                <StyledTableCell sx={{ width: "120px" }}>
                  {task?.estimateValue}
                </StyledTableCell>
                <StyledTableCell sx={{ width: "120px" }}>
                  {task?.azureValue}
                </StyledTableCell>
                <StyledTableCell sx={{ width: "120px" }}>
                  {task?.userStoryNumber}
                </StyledTableCell>
                <StyledTableCell sx={{ width: "120px" }}>
                  {task?.taskNumber}
                </StyledTableCell>
                <StyledTableCell>{task?.client?.name}</StyledTableCell>
                <StyledTableCell>{task?.project?.name}</StyledTableCell>

                <StyledTableCell sx={{ padding: 0, width: "20px" }}>
                  <IconButton onClick={onEdit(index)}>
                    <EditIcon color="primary" />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell sx={{ padding: 0, width: "40px" }}>
                  <IconButton onClick={onDelete(index)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        {!tasks.length ? <EmptyComponent /> : null}
      </TableContainer>
    </>
  );
};

export default TasksTable;
