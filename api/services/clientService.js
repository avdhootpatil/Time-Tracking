import camelcaseKeys from "camelcase-keys";
import {
  addClient,
  deleteClient,
  getClientById,
  getClientList,
  getClients,
  updateClient,
} from "../data/repositories/clientRepository.js";
import { getTotalCount } from "../helperFunctions.js";
import { Pagination } from "../data/models/common.js";
import Client from "../data/models/client.js";

export const getClientListService = async (page, pageSize) => {
  try {
    // return await getClientList(page, pageSize);
    let clientList = await getClientList(page, pageSize);

    let totalCount = getTotalCount(clientList[0]);

    let paginatedResult = new Pagination(
      clientList,
      totalCount,
      page,
      pageSize
    );

    //format result
    let newItems = [];
    paginatedResult.items.forEach((client) => {
      let { ClientId, ClientName, ClientDescription } = client;
      let newClient = new Client(ClientId, ClientName, ClientDescription);
      newItems.push(newClient);
    });

    paginatedResult["items"] = newItems;

    paginatedResult = camelcaseKeys(paginatedResult, { deep: true });

    return paginatedResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getClientsService = async () => {
  try {
    let clients = await getClients();
    clients = camelcaseKeys(clients, { deep: true });
    return clients;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addClientService = async (name, description, id) => {
  try {
    await addClient(name, description, id);
    return;
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
    if (clientId == 0) {
      throw new Error("Invalid client id");
    }
    await updateClient(name, description, userId, clientId);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteClientService = async (userId, clientId) => {
  try {
    if (clientId == 0) {
      throw new Error("Invalid client id");
    }
    await deleteClient(userId, clientId);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getClientByIdService = async (clientId) => {
  try {
    let result = await getClientById(clientId);

    let { ClientId, ClientName, ClientDescription } = result.recordset[0];

    let client = new Client(ClientId, ClientName, ClientDescription);

    return client;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
