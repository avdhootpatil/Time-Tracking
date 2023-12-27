/**
 * Constructor function to create task
 * @param {string} taskName
 * @param {number} clientId
 * @param {number} projectId
 * @param {number} estimateValue
 * @param {number} azureValue
 * @param {number} userStoryNumber
 * @param {number} taskNumber
 * @param {number} userId
 */

function Task(
  taskName,
  clientId,
  projectId,
  estimateValue,
  azureValue,
  userStoryNumber,
  taskNumber,
  userId
) {
  this.taskName = taskName;
  this.clientId = clientId;
  this.projectId = projectId;
  this.estimateValue = estimateValue;
  this.azureValue = azureValue;
  this.userStoryNumber = userStoryNumber;
  this.taskNumber = taskNumber;
  this.userId = userId;
}

export default Task;
