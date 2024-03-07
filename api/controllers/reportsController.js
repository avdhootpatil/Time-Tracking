import fs from "fs";
import {
  exportBillingSheetService,
  exportTimeSheetService,
  getBillingSheetService,
  getTimsheetService,
} from "../services/reportsService.js";

export const getTimsheet = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    let { user } = req;
    let userId = user.id;

    let timeSheet = await getTimsheetService(startDate, endDate, userId);

    res.status(200).send(timeSheet);
  } catch (e) {
    res.status(500).send({ error: e.messgae });
  }
};

export const exportTimesheet = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    let { user } = req;
    let userId = user.id;

    let workBook = await exportTimeSheetService(startDate, endDate, userId);

    //path to download excel
    const filePath = "timesheet.xlsx";

    await workBook.xlsx.writeFile(filePath).then(() => {
      //send the file to the client
      res.download(filePath, "timesheet.xlsx", (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error sending file");
        }

        // Remove the temporary file after download
        fs.unlinkSync(filePath);
      });
    });
  } catch (e) {
    res.status(500).send({ error: e.messgae });
  }
};

export const getBillingSheet = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    let { user } = req;
    let userId = user.id;

    let employeesTaskTime = await getBillingSheetService(
      startDate,
      endDate,
      userId
    );

    res.status(200).send(employeesTaskTime);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

export const exportBillingSheet = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let { user } = req;
    let userId = user.id;

    let workBook = await exportBillingSheetService(startDate, endDate, userId);

    //path to download excel
    const filePath = "billingSheet.xlsx";

    await workBook.xlsx.writeFile(filePath).then(() => {
      //send the file to the client
      res.download(filePath, "timesheet.xlsx", (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error sending file");
        }

        // Remove the temporary file after download
        fs.unlinkSync(filePath);
      });
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};
