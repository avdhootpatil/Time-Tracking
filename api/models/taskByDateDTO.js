function TaskByDate(id, date, tasks) {
  this.id = id;
  this.date = date;
  this.tasks = tasks || [];
}

export default TaskByDate;
