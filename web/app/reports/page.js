"use client";

import DateRangePicker from "@/lib/components/DateRangePicker";
import { WithAuthentication } from "@/lib/components/auth";
import { TimesheetTable } from "@/lib/components/table";
import BillingSheetTable from "@/lib/components/table/BillingSheetTable";
import {
  formatBillingSheet,
  getUserFromLocalStorage,
} from "@/lib/helperFunctions";
import { getProjects } from "@/lib/services/project";
import {
  exportBillingSheet,
  exportTimesheet,
  getBillingSheet,
  getTimeSheet,
} from "@/lib/services/reports";
import { Box, Button } from "@mui/material";
import { saveAs } from "file-saver";
import { produce } from "immer";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Reports() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({
    startDate: null,
    endDate: null,
  });
  const [pageFilterOptions, setPageFilterOptions] = useState([
    { id: 1, name: "Timesheet" },
    { id: 2, name: "Project Wise Breakdown" },
  ]);

  const [pageFilter, setPageFilter] = useState(null);
  const [projects, setProjects] = useState([]);
  const [billingSheet, setBillingSheet] = useState([]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      let user = getUserFromLocalStorage();
      setUser(user);
      setPageFilter(pageFilterOptions[0]);
      await getAllProjects(user?.token || "");
    })();
  }, []);

  const getTimesheetDetails = async (startDate, endDate, token) => {
    let response = await getTimeSheet(startDate, endDate, token);

    if (response.status === "success") {
      setTasks(response.data);
    } else {
      toast.error("Unable to get timesheet details");
    }
  };

  const getBillingSheetDetails = async (startDate, endDate, token) => {
    let response = await getBillingSheet(startDate, endDate, token);
    if (response.status === "success") {
      let billingSheet = formatBillingSheet(response.data, projects);
      setBillingSheet(billingSheet);
    } else {
      toast.error("Unable to get billing sheet details details");
    }
  };

  const getAllProjects = async (token) => {
    let response = await getProjects(token);
    if (response.status === "success") {
      setProjects(response.data);
    } else {
      toast.error("Unbale to get projects. Please refresh");
    }
  };

  const handleChange = (name) => (e) => {
    let nextState = produce(filter, (draft) => {
      switch (name) {
        case "startDate":
          draft[name] = e;
          break;
        case "endDate":
          draft[name] = e;
          break;
        default:
          break;
      }
    });
    setFilter(nextState);
  };

  const handleSearch = async (e) => {
    let { startDate, endDate } = filter;

    if (pageFilter?.id === 1) {
      await getTimesheetDetails(startDate, endDate, user?.token);
    } else {
      if (!startDate || !endDate) {
        toast.error("Start date, End date is required");
      } else {
        await getBillingSheetDetails(startDate, endDate, user?.token);
      }
    }
  };

  const handleTimesheetExport = async (e) => {
    let { startDate, endDate } = filter;

    if (pageFilter?.id === 1) {
      let response = await exportTimesheet(startDate, endDate, user?.token);
      if (response.status === "success") {
        let blob = response.data;
        saveAs(blob, "timesheet.xlsx");
      } else {
        toast.error("Unable to export timesheet");
      }
    } else {
      let response = await exportBillingSheet(startDate, endDate, user?.token);
      if (response.status === "success") {
        let blob = response.data;
        saveAs(blob, "billingsheet.xlsx");
      } else {
        toast.error("Unable to export Billing sheet");
      }
    }
  };

  const handleChangePageFilter = (index) => (e) => {
    let currentFilter = pageFilterOptions[index];
    setPageFilter(currentFilter);
    setFilter({
      startDate: null,
      endDate: null,
    });
  };

  return (
    <div className="page-container">
      <Box sx={{ display: "flex", padding: "10px" }}>
        {pageFilterOptions.map((filter, index) => (
          <Button
            variant={filter.id === pageFilter?.id ? "contained" : "outlined"}
            sx={{ marginRight: "20px" }}
            key={filter.id}
            onClick={handleChangePageFilter(index)}
          >
            {filter.name}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            padding: "10px",
            width: "50%",
          }}
        >
          <DateRangePicker
            endDateVisibility={true}
            startDateLabel="Start Date"
            endDateLabel="End Date"
            startDate={filter.startDate}
            endDate={filter.endDate}
            onChange={handleChange}
          />
        </Box>
        <Box sx={{ marginTop: "20px", marginRight: "20px" }}>
          <Button variant="contained" onClick={handleSearch}>
            Go
          </Button>
        </Box>
        <Box sx={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            onClick={handleTimesheetExport}
            disabled={
              pageFilter?.id === 1 ? !tasks.length : !billingSheet.length
            }
          >
            Export To Excel
          </Button>
        </Box>
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        {pageFilter?.id === 1 ? (
          <TimesheetTable tasks={tasks} />
        ) : (
          <BillingSheetTable projects={projects} billingSheet={billingSheet} />
        )}
      </Box>
    </div>
  );
}

export default WithAuthentication(Reports);
