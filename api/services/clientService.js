import {
  addClient,
  deleteClient,
  getClientById,
  getClientList,
  getClients,
  updateClient,
} from "../data/repositories/clientRepository.js";

export const getClientListService = async (page, pageSize) => {
  try {
    return await getClientList(page, pageSize);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getClientsService = async () => {
  try {
    return await getClients();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addClientService = async (name, description, id) => {
  try {
    return await addClient(name, description, id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateClientService = async (
  name,
  description,
  userId,
  clientId
) => {
  try {
    return await updateClient(name, description, userId, clientId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteClientService = async (userId, clientId) => {
  try {
    return await deleteClient(userId, clientId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getClientByIdService = async (clientId) => {
  try {
    return await getClientById(clientId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
