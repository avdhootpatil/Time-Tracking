import {
  deleteHoliday,
  getHolidays,
  getSingleHoliday,
  saveHoliday,
  updateHoliday,
} from "../data/repositories/holidayRepository.js";

export const getHolidaysService = async (year) => {
  try {
    return await getHolidays(year);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSingleHolidayService = async (id) => {
  try {
    return await getSingleHoliday(id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const saveHolidayService = async (date, description, userId) => {
  try {
    return saveHoliday(date, description, userId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateHolidayService = async (holidayId, description, userId) => {
  try {
    return await updateHoliday(holidayId, description, userId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteHolidayService = async (holidayId, userId) => {
  try {
    return await deleteHoliday(holidayId, userId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
