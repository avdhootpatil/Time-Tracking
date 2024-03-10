import { Task } from "../data/models/index.js";
import { taskSchema } from "../schema/index.js";
import {
  addTimeEntryService,
  dailyHoursLoggedService,
  deleteTimeEntryService,
  getTimeSheetDetailsyUserIdService,
  gettasksbydateService,
  updateTimeEntryService,
} from "../services/timeSheetService.js";

export const getTimeSheetDetailsyUserId = async (req, res) => {
  try {
    let { startDate, endDate, userId } = req.body;

    if (!startDate || !endDate)
      return res.status(400).send({ message: "Missing parameters" });

    let tasks = await getTimeSheetDetailsyUserIdService(
      startDate,
      endDate,
      userId
    );

    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const gettasksbydate = async (req, res) => {
  try {
    let { taskDate } = req.query;
    let user = req.user;
    let userId = user.id;

    if (!userId || !taskDate)
      return res.status(400).send({ message: "Missing parameters" });

    let tasks = await gettasksbydateService(userId, taskDate);

    res.status(200).send(tasks);
  } catch (err) {
    console.error(err);
    res.send(500).send({ message: err.message });
  }
};

export const deleteTimeEntry = async (req, res) => {
  try {
    let { id } = req.params;
    let userId = req.user.id;

    await deleteTimeEntryService(id, userId);

    res.status(201).send({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const addTimeEntry = async (req, res) => {
  try {
    let { user } = req;
    let userId = user.id;
    let {
      taskDate,
      taskName,
      clientId,
      projectId,
      estimateValue,
      azureValue,
      userStoryNumber,
      taskNumber,
    } = req.body;

    await addTimeEntryService(
      taskName,
      clientId,
      projectId,
      estimateValue,
      azureValue,
      userStoryNumber,
      taskNumber,
      userId,
      taskDate
    );

    // let taskTable = new sql.Table();

    // taskTable.columns.add("TaskId", sql.Int);
    // taskTable.columns.add("TaskName", sql.VarChar, {
    //   length: 100,
    //   nullable: true,
    // });

    // taskTable.columns.add("ClientId", sql.Int);
    // taskTable.columns.add("ProjectId", sql.Int);
    // taskTable.columns.add("EstimateValue", sql.Int);
    // taskTable.columns.add("AzureValue", sql.Int);
    // taskTable.columns.add("UserStoryNumber", sql.Int);
    // taskTable.columns.add("TaskNumber", sql.Int);
    // taskTable.columns.add("UserId", sql.Int);
    // taskTable.columns.add("IsActive", sql.Bit);
    // taskTable.columns.add("CreatedDate", sql.DateTime);
    // taskTable.columns.add("CreatedBy", sql.Int);
    // taskTable.columns.add("ModifiedBy", sql.Int);
    // taskTable.columns.add("ModifiedDate", sql.DateTime);

    // for (let i = 0; i < tasks.length; i++) {
    //   taskTable.rows.add(
    //     tasks[i].taskId,
    //     tasks[i].taskName,
    //     tasks[i].clientId,
    //     tasks[i].projectId,
    //     tasks[i].estimateValue,
    //     tasks[i].azureValue,
    //     tasks[i].userStoryNumber,
    //     tasks[i].taskNumber,
    //     userId,
    //     1,
    //     taskDate,
    //     userId,
    //     userId,
    //     new Date().toISOString()
    //   );
    // }

    // console.log(taskTable);

    // await pool.request().input("tvp", taskTable).execute("AddTimeEntry");

    res.status(201).send({ messgae: "Task added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

export const validateTimeEntry = async (req, res, next) => {
  try {
    let {
      taskName,
      clientId,
      projectId,
      estimateValue,
      azureValue,
      userStoryNumber,
      taskNumber,
      taskDate,
    } = req.body;

    let { id } = req.user;

    let task = new Task(
      0,
      taskName,
      clientId,
      undefined,
      projectId,
      undefined,
      estimateValue,
      azureValue,
      userStoryNumber,
      taskNumber,
      id,
      taskDate
    );

    await taskSchema.validate(task, { abortEarly: false });

    next();
  } catch (err) {
    // add errors in object with key as prop name and value as prop value
    let taskErrors = {};
    err.inner.forEach((err) => {
      taskErrors[err.path] = err.errors;
    });

    return res.status(400).json(taskErrors);
  }
};

export const dailyHoursLogged = async (req, res) => {
  try {
    let { month, year } = req.query;
    let userId = req.user.id;

    let hours = await dailyHoursLoggedService(month, year, userId);

    res.status(201).send(hours);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const updateTimeEntry = async (req, res) => {
  try {
    let { id } = req.params;
    let {
      taskName,
      clientId,
      projectId,
      estimateValue,
      azureValue,
      userStoryNumber,
      taskNumber,
    } = req.body;

    let userId = req.user.id;

    await updateTimeEntryService(
      id,
      taskName,
      clientId,
      projectId,
      estimateValue,
      azureValue,
      userStoryNumber,
      taskNumber,
      userId
    );

    res.status(201).send({ message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};
