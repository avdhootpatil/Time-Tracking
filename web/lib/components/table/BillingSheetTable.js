import { getTotalAzureHours } from "@/lib/helperFunctions";

import { useEffect, useState } from "react";
import EmptyComponent from "../emptyComponent";
import { Table } from "@mui/joy";

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
    <div className="border border-solid border-grey-500">
      <Table borderAxis="both" size="md">
        <thead>
          <tr>
            {tableHeader.map((header) => (
              <th>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {billingSheet.map((employee, index) => (
            <tr key={index}>
              <td sx={{ width: "20%" }}>{employee.name}</td>
              <td sx={{ width: "120px" }}>{employee.workingDays}</td>
              <td sx={{ width: "120px" }}>{employee.totalHours}</td>
              {employee.projectTime.map((project, index) => (
                <td key={project.id} sx={{ width: "120px" }}>
                  {project.time}
                </td>
              ))}
              <td sx={{ width: "20%" }}>
                {getTotalAzureHours(employee.projectTime)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {!billingSheet.length ? <EmptyComponent /> : null}
    </div>
  );
};

export default BillingSheetTable;
