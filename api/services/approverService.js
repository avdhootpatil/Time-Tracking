import { getApprovers } from "../data/repositories/approverReposiory.js";

export const getApproversService = async (userId) => {
  try {
    let approvers = await getApprovers(userId);
    return approvers;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
