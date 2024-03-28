import camelcaseKeys from "camelcase-keys";
import ApprovalStatus from "../data/models/approvalStatus.js";
import Approver from "../data/models/approverDTO.js";
import Leave from "../data/models/leaveDTO.js";
import LeaveType from "../data/models/leaveTypeDTO.js";
import {
  addUserLeaves,
  getAllLeaves,
  getLeaveBalance,
  getLeaveById,
  getLeaveTypes,
  getLeavesByDate,
  getLeavesByMonth,
  requestLeave,
  updateLeave,
  updateUserLeaves,
  withDraw,
} from "../data/repositories/leaveRepository.js";
import { getHolidaysService } from "./holidayService.js";

export const requestLeaveService = async (
  leaveTypeId,
  from,
  to,
  reason,
  userId,
  approverId,
  leaveRequestFor
) => {
  try {
    // if (new Date(from) < new Date()) {
    //   throw new Error("Cannot apply leave for past dates and same date.");
    // }

    let numberOfDays;
    let leaveDates = [];
    // check if half day
    if (leaveRequestFor === "half-day") {
      numberOfDays = 0.5;
      leaveDates.push(from);
    } else {
      // get all the dates between date range
      let currentDate = new Date(from);
      let endDate = new Date(to);
      let dates = [];
      let years = {};
      let holidays = [];

      while (currentDate <= endDate) {
        let day = currentDate.getDay();
        let year = currentDate.getFullYear();

        if (day != 0 && day != 6) {
          //get the years for getting holidays of that year
          if (years.hasOwnProperty(year)) {
            years[year] = years[year] + 1;
          } else {
            years[year] = 1;
          }

          dates.push(currentDate.toISOString());
        }

        //set currentDate as endDate in last iteration
        let date = new Date();
        date.setDate(currentDate.getDate() + 1);
        let nextDate = date.getDate();
        let nextMonth = date.getMonth();
        let nextYear = date.getFullYear();

        if (
          nextDate == endDate.getDate() &&
          nextMonth == endDate.getMonth() &&
          nextYear == endDate.getFullYear()
        ) {
          date = endDate;
        }

        // set current date
        currentDate = date;
      }

      // get all holidays between date range
      let yearKeys = Object.keys(years);
      for (let year in yearKeys) {
        let holidayRes = await getHolidaysService(yearKeys[year]);
        holidays = [...holidays, ...holidayRes];
      }

      //remove holidays from dates
      holidays.forEach((holiday) => {
        let holidayDate = holiday.date.toISOString();
        let index = dates.findIndex(
          (date) => date.split("T")[0] === holidayDate.split("T")[0]
        );
        if (index >= 0) {
          dates.splice(index, 1);
        }
      });

      // if previous leaves are present on same date then send 400
      let leaves = await getLeavesByDate(dates[0], dates[dates.length]);
      if (leaves.length) {
        throw new Error("Cannot request multiple leaves on single day");
      }

      //if the dates are 0 throw error
      if (!dates.length) {
        throw new Error("Please apply for leave on valid day.");
      }

      // store leaves datewise
      numberOfDays = dates.length;
      leaveDates = dates;
    }

    await requestLeave(
      leaveDates,
      leaveTypeId,
      from,
      to,
      reason,
      numberOfDays,
      userId,
      approverId,
      leaveRequestFor
    );

    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateLeaveService = async (
  leaveId,
  leaveTypeId,
  from,
  to,
  reason,
  numberOfDays,
  userId,
  approverId
) => {
  try {
    await updateLeave(
      leaveId,
      leaveTypeId,
      from,
      to,
      reason,
      numberOfDays,
      userId,
      approverId
    );

    await updateUserLeaves(leaveId, approverId);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const withDrawService = async (leaveId) => {
  try {
    await withDraw(leaveId);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllLeavesService = async (userId) => {
  try {
    let leaves = await getAllLeaves(userId);
    return camelcaseKeys(leaves);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLeaveByIdService = async (leaveId) => {
  try {
    let result = await getLeaveById(leaveId);

    let leave = camelcaseKeys(result);
    let approver = null;

    //set approver
    if (leave?.approverId > 0) {
      approver = new Approver(leave.approverId, leave.approverName);
    }

    let approvalStatus = new ApprovalStatus(
      leave.approvalStatusId,
      leave.approvalStatusName
    );

    let leaveType = new LeaveType(leave.leaveTypeId, leave.leaveTypeName);

    leave = new Leave(
      leaveId,
      leaveType,
      leave.from,
      leave.to,
      leave.reason,
      approvalStatus,
      approver,
      leave.numberOfDays
    );

    return leave;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLeaveTypesService = async () => {
  try {
    let leaveTypes = await getLeaveTypes();
    return leaveTypes;
  } catch (error) {
    throw error;
  }
};

export const getLeaveBalanceService = async (userId) => {
  try {
    let leaveBalance = await getLeaveBalance(userId);
    leaveBalance = camelcaseKeys(leaveBalance);

    let leaveTypeDays = {};

    leaveBalance.forEach((lBalance) => {
      leaveTypeDays[lBalance.leaveTypeName] = lBalance.numberOfDays;
    });

    let leaveTypes = await getLeaveTypesService();

    leaveTypes.forEach((leaveType) => {
      leaveType.totalLeaves = 7;
      if (leaveTypeDays.hasOwnProperty(leaveType.name)) {
        leaveType.leavesTaken = leaveTypeDays[leaveType.name];
        leaveType.balance =
          leaveType.totalLeaves - leaveTypeDays[leaveType.name];
      } else {
        leaveType.leavesTaken = 0;
        leaveType.balance = leaveType.totalLeaves;
      }
    });

    return camelcaseKeys(leaveTypes);
  } catch (error) {
    throw error;
  }
};

export const getLeavesByMonthService = async (userId, month) => {
  try {
    let leaves = await getLeavesByMonth(userId, month);
    return camelcaseKeys(leaves);
  } catch (error) {
    throw error;
  }
};

export const approveLeavesService = () => {};
