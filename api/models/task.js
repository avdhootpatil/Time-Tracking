/**
 * Constructor function to create task
 * @param {number} taskId
 * @param {string} taskName
 * @param {number} clientId
 * @param {string} clientName
 * @param {number} projectId
 * @param {string} projectName
 * @param {number} estimateValue
 * @param {number} azureValue
 * @param {number} userStoryNumber
 * @param {number} taskNumber
 * @param {number} userId
 * @param {string} taskDate
 */

function Task(
  taskId,
  taskName,
  clientId,
  clientName,
  projectId,
  projectName,
  estimateValue,
  azureValue,
  userStoryNumber,
  taskNumber,
  userId,
  taskDate
) {
  this.taskId = taskId;
  this.taskName = taskName;
  this.clientId = clientId;
  this.clientName = clientName;
  this.projectId = projectId;
  this.projectName = projectName;
  this.estimateValue = estimateValue;
  this.azureValue = azureValue;
  this.userStoryNumber = userStoryNumber;
  this.taskNumber = taskNumber;
  this.userId = userId;
  this.taskDate = taskDate;
}

export default Task;
