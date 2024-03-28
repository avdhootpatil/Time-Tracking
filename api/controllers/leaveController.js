import {
  getAllLeavesService,
  getLeaveBalanceService,
  getLeaveByIdService,
  getLeaveTypesService,
  getLeavesByMonthService,
  requestLeaveService,
  updateLeaveService,
  withDrawService,
} from "../services/leaveService.js";

export const requestLeave = async (req, res) => {
  try {
    let { id } = req.user;
    let { leaveTypeId, from, to, reason, approverId, leaveRequestFor } =
      req.body;
    await requestLeaveService(
      leaveTypeId,
      from,
      to,
      reason,
      id,
      approverId,
      leaveRequestFor
    );
    res.status(201).send({ message: "Leave Requested created successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const updateLeave = async (req, res) => {
  try {
    let { leaveTypeId, from, to, reason, numberOfDays, userId, approverId } =
      req.body;
    let { id } = req.params;

    await updateLeaveService(
      id,
      leaveTypeId,
      from,
      to,
      reason,
      numberOfDays,
      userId,
      approverId
    );

    res.status(200).send({ message: "Leave updated successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const withDraw = async (req, res) => {
  try {
    let { id } = req.params;
    await withDrawService(id);
    res.status(200).send({ message: "Leave deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    let { id } = req.user;
    let leaves = await getAllLeavesService(id);
    res.status(200).send(leaves);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getLeaveById = async (req, res) => {
  try {
    let { id } = req.params;

    let leave = await getLeaveByIdService(id);

    res.status(200).send(leave);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getLeaveTypes = async (req, res) => {
  try {
    let leaves = await getLeaveTypesService();
    res.status(200).send(leaves);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getLeaveBalance = async (req, res) => {
  try {
    let userId = req.user.id;
    let leaveBalance = await getLeaveBalanceService(userId);
    res.status(200).send(leaveBalance);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getLeavesByMonth = async (req, res) => {
  try {
    let userId = req.user.id;
    let month = req.query.month;
    let leaves = await getLeavesByMonthService(userId, month);
    res.status(200).send(leaves);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const approveLeaves = (req, res) => {};
