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
  requestLeave,
  updateLeave,
  updateUserLeaves,
  withDraw,
} from "../data/repositories/leaveRepository.js";

export const requestLeaveService = async (
  leaveTypeId,
  from,
  to,
  reason,
  numberOfDays,
  userId,
  approverId
) => {
  try {
    let leaveId = await requestLeave(
      leaveTypeId,
      from,
      to,
      reason,
      numberOfDays,
      userId,
      approverId
    );

    //insert into user leaves
    await addUserLeaves(userId, leaveId, approverId);
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

export const approveLeavesService = () => {};
