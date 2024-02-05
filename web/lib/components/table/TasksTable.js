import { AddCircleOutline, Delete } from "@mui/icons-material";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

const TasksTable = ({
  tasks,
  handleAddTask,
  handleChange,
  handleDeleteTask,
}) => {
  return (
    <>
      <Paper sx={{ margin: "1rem", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "80vh" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Task Name</TableCell>
                <TableCell>Estimate Value</TableCell>
                <TableCell>Azure Value</TableCell>
                <TableCell>User Story No.</TableCell>
                <TableCell>Task No.</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Project</TableCell>

                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task, index) => (
                <TableRow key={task.taskId}>
                  <TableCell>
                    <TextField
                      size="small"
                      onChange={handleChange(index)}
                      name="taskName"
                      value={task?.taskName}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      name="estimateValue"
                      value={task?.estimateValue}
                      onChange={handleChange(index)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      name="azureValue"
                      value={task?.azureValue}
                      onChange={handleChange(index)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      name="userStoryNumber"
                      value={task?.userStoryNumber}
                      onChange={handleChange(index)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      name="taskNumber"
                      value={task?.taskNumber}
                      onChange={handleChange(index)}
                    />
                  </TableCell>
                  <TableCell>
                    {/* <TasksTableClientAutocomplete
                      handleChange={handleChange}
                      index={index}
                      value={task?.client?.name || ""}
                    /> */}
                  </TableCell>

                  {/* <TasksTableProjectAutocomplete
                    handleChange={handleChange}
                    index={index}
                    value={task?.project?.name}
                  /> */}

                  <TableCell sx={{ padding: 0 }}>
                    <IconButton onClick={handleAddTask(index)}>
                      <AddCircleOutline color="primary" />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ padding: 0 }}>
                    <IconButton onClick={handleDeleteTask(index)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default TasksTable;
