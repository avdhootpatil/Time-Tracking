import camelcaseKeys from "camelcase-keys";
import {
  deleteHoliday,
  getHolidays,
  getSingleHoliday,
  saveHoliday,
  updateHoliday,
} from "../data/repositories/holidayRepository.js";

export const getHolidaysService = async (year) => {
  try {
    if (year === null || year === "" || year === undefined) {
      throw new Error("Year cannot be empty");
    }

    let holidays = await getHolidays(year);
    holidays = camelcaseKeys(holidays);
    return holidays;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSingleHolidayService = async (id) => {
  try {
    let holiday = await getSingleHoliday(id);
    holiday = camelcaseKeys(holiday);
    return holiday;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const saveHolidayService = async (date, description, userId) => {
  try {
    await saveHoliday(date, description, userId);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateHolidayService = async (holidayId, description, userId) => {
  try {
    if (holidayId === 0) {
      throw new Error("Invalid Id");
    }
    await updateHoliday(holidayId, description, userId);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteHolidayService = async (holidayId, userId) => {
  try {
    if (holidayId === 0) {
      throw new Error("Invalid Id");
    }
    await deleteHoliday(holidayId, userId);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
