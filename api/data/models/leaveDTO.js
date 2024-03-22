function Leave(
  leaveId,
  leaveType,
  from,
  to,
  reason,
  approvalStatus,
  approver,
  numberOfDays
) {
  this.leaveId = leaveId;
  this.leaveType = leaveType;
  this.from = from;
  this.to = to;
  this.reason = reason;
  this.approvalStatus = approvalStatus;
  this.approver = approver;
  this.numberOfDays = numberOfDays;
}

export default Leave;
