import {
  getBillingSheet,
  getTimsheet,
} from "../data/repositories/reportsRepository.js";

export const getTimsheetService = async (startDate, endDate, userId) => {
  try {
    return await getTimsheet(startDate, endDate, userId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getBillingSheetService = async (startDate, endDate, userId) => {
  try {
    return getBillingSheet(startDate, endDate, userId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
