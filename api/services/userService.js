import {
  checkEmail,
  getUsers,
  registerUser,
} from "../data/repositories/userRepository.js";

export const checkEmailService = async (userEmail) => {
  try {
    return await checkEmail(userEmail);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const registerUserService = async (
  userName,
  userEmail,
  hashedPassword
) => {
  try {
    return await registerUser(userName, userEmail, hashedPassword);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUsersService = async () => {
  try {
    return await getUsers();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
