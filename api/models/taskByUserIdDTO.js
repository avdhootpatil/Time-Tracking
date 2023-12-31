function TaskByUserIdDTO(startDate, endDate, timeEntries) {
  this.startDate = startDate;
  this.endDate = endDate;
  this.timeEntries = timeEntries || [];
}

export default TaskByUserIdDTO;
