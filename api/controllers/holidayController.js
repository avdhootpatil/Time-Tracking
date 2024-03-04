import camelcaseKeys from "camelcase-keys";
import { Holiday } from "../models/index.js";
import { holidaySchema } from "../schema/index.js";
import {
  deleteHolidayService,
  getHolidaysService,
  getSingleHolidayService,
  saveHolidayService,
  updateHolidayService,
} from "../services/holidayService.js";

export const getHolidays = async (req, res) => {
  try {
    let { year } = req.query;

    if (year === null || year === "" || year === undefined) {
      res.status(500).send({ message: "Year cannot be empty" });
    }

    let holidays = await getHolidaysService(year);

    holidays = camelcaseKeys(holidays);

    res.status(200).send(holidays);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

export const getSingleHoliday = async (req, res) => {
  try {
    let { id } = req.params;

    let holiday = await getSingleHolidayService(id);

    let response = camelcaseKeys(holiday);

    res.status(200).send(response);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

export const saveHoliday = async (req, res) => {
  try {
    let { date, description } = req.body;
    let { id } = req.user;

    await saveHolidayService(date, description, id);

    res.status(201).send({ message: "Holiday Added successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.message });
  }
};

export const updateHoliday = async (req, res) => {
  try {
    let { id } = req.user;
    let { date, description } = req.body;
    let holidayId = req.params.id;

    if (id === 0) {
      throw new Error("Invalid Id");
    }

    await updateHolidayService(holidayId, description, id);

    res.status(201).send({ message: "Updated successfully" });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

export const deleteHoliday = async (req, res) => {
  try {
    let { id } = req.user;
    let holidayId = req.params.id;

    if (id === 0) {
      throw new Error("Invalid Id");
    }

    await deleteHolidayService(holidayId, id);

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
