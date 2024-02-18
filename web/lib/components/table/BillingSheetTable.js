import { getTotalAzureHours } from "@/lib/helperFunctions";
import { StyledTableCell, StyledTableRow } from "@/lib/styles/tableStyles";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  getCardHeaderUtilityClass,
} from "@mui/material";
import EmptyComponent from "../emptyComponent";
import { useEffect, useState } from "react";

const BillingSheetTable = ({ projects = [], billingSheet = [] }) => {
  const [tableHeader, setTableHeader] = useState([]);

  useEffect(() => {
    if (projects.length) {
      let headers = ["Name", "Work Days In Month", "Available Hours"];
      projects.forEach((project) => {
        headers.push(project.name);
      });
      headers.push("Total Azure Hours");

      setTableHeader(headers);
    }
  }, [projects]);

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
              {tableHeader.map((header) => (
                <StyledTableCell>{header}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {billingSheet.map((employee, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell sx={{ width: "20%" }}>
                  {employee.name}
                </StyledTableCell>
                <StyledTableCell sx={{ width: "120px" }}>
                  {employee.workingDays}
                </StyledTableCell>
                <StyledTableCell sx={{ width: "120px" }}>
                  {employee.totalHours}
                </StyledTableCell>
                {employee.projectTime.map((project, index) => (
                  <StyledTableCell key={project.id} sx={{ width: "120px" }}>
                    {project.time}
                  </StyledTableCell>
                ))}
                <StyledTableCell sx={{ width: "20%" }}>
                  {getTotalAzureHours(employee.projectTime)}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        {!billingSheet.length ? <EmptyComponent /> : null}
      </TableContainer>
    </>
  );
};

export default BillingSheetTable;
