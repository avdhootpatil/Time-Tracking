import camelcaseKeys from "camelcase-keys";
import sql from "mssql";
import { Holiday } from "../models/index.js";
import { holidaySchema } from "../schema/index.js";

export const getHolidays = async (req, res) => {
  try {
    let pool = req.db;

    let { year } = req.query;

    if (year === null || year === "" || year === undefined) {
      res.status(500).send({ message: "Year cannot be empty" });
    }

    let result = await pool
      .request()
      .input("Year", sql.Int, year)
      .execute("GetAllYearlyHolidays");

    let response = result.recordset;

    res.status(200).send(response);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

export const getSingleHoliday = async (req, res) => {
  try {
    let pool = req.db;
    let { id } = req.params;

    let result = await pool.request().input("ID", sql.Int, id).query(`
    SELECT HoliDayId, Description, Date FROM Holidays
    WHERE
        IsActive=1
    AND
        HolidayId=@ID
    `);

    let response = camelcaseKeys(result.recordset[0]);

    res.status(200).send(response);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

export const saveHoliday = async (req, res) => {
  try {
    let pool = req.db;

    let { date, description } = req.body;
    let { id } = req.user;

    await pool
      .request()
      .input("Date", sql.DateTime, date)
      .input("Description", sql.VarChar, description)
      .input("CreatedBy", sql.Int, id)
      .execute("AddHoliday");

    res.status(201).send({ message: "Holiday Added successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.message });
  }
};

export const updateHoliday = async (req, res) => {
  try {
    let pool = req.db;
    let { id } = req.user;
    let { date, description } = req.body;
    let holidayId = req.params.id;

    if (id === 0) {
      throw new Error("Invalid Id");
    }

    await pool
      .request()
      .input("HolidayId", sql.Int, holidayId)
      .input("Description", sql.VarChar(200), description)
      .input("UserId", sql.Int, id)
      .execute("UpdateHolidayDetails");

    res.status(201).send({ message: "Updated successfully" });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

export const deleteHoliday = async (req, res) => {
  try {
    let pool = req.db;
    let { id } = req.user;
    let holidayId = req.params.id;

    if (id === 0) {
      throw new Error("Invalid Id");
    }

    await pool
      .request()
      .input("HolidayId", sql.Int, holidayId)
      .input("UserId", sql.Int, id)
      .execute("DeleteHoliday");

    res.status(201).send({ message: "Deleted successfully" });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

export const validateHolidayDetails = async (req, res, next) => {
  //validate holiday
  try {
    let { date, description } = req.body;

    let holiday = new Holiday(0, date, description);

    await holidaySchema.validate(holiday, {
      abortEarly: false,
    });

    next();
  } catch (e) {
    // add errors in object with key as prop name and value as prop value
    let errors = {};
    e.inner.forEach((err) => {
      errors[err.path] = err.errors;
    });

    return res.status(400).json(errors);
  }
};
