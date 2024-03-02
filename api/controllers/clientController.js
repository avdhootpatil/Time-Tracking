import camelcaseKeys from "camelcase-keys";
import { extractPageQuery, getTotalCount } from "../helperFunctions.js";
import { Pagination } from "../models/common.js";
import { Client } from "../models/index.js";
import { clientSchema } from "../schema/index.js";
import {
  addClientService,
  deleteClientService,
  getClientByIdService,
  getClientListService,
  getClientsService,
  updateClientService,
} from "../services/clientService.js";

export const clientList = async (req, res) => {
  try {
    // get page, pageSize from query object
    let { page, pageSize } = extractPageQuery(req.query);

    let clientList = await getClientListService(page, pageSize);

    let totalCount = getTotalCount(clientList);

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

    res.status(200).send(paginatedResult);
  } catch (e) {
    res.status(500).send({ error: e.messgae });
  }
};

export const getClients = async (req, res) => {
  try {
    let clients = await getClientsService();

    clients = camelcaseKeys(clients, { deep: true });

    res.status(200).send(clients);
  } catch (e) {
    res.status(400).send({ error: e.messgae });
  }
};

export const addClient = async (req, res) => {
  try {
    let { name, description } = req.body;
    let { id } = req.user;

    await addClientService(name, description, id);
    res.status(201).send({ message: "Client added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    let { id } = req.params;
    let { name, description } = req.body;
    let userId = req.user.id;

    if (id == 0) {
      throw new Error("Invalid client id");
    }

    await updateClientService(name, description, userId, id);

    res.status(201).send({ message: "Client updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    let { id } = req.params;
    let userId = req.user.id;

    if (id == 0) {
      throw new Error("Invalid client id");
    }

    await deleteClientService(userId, id);

    res.status(201).send({ message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const getClientById = async (req, res) => {
  try {
    let { id } = req.params;

    let result = await getClientByIdService(id);

    let { ClientId, ClientName, ClientDescription } = result.recordset[0];

    let client = new Client(ClientId, ClientName, ClientDescription);

    res.status(200).send(client);
  } catch (e) {
    res.status(400).send({ error: e });
  }
};

export const validateClient = async (req, res, next) => {
  try {
    let { name, description } = req.body;

    let client = new Client(0, name, description);

    await clientSchema.validate(client, {
      abortEarly: false,
    });

    next();
  } catch (err) {
    // add errors in object with key as prop name and value as prop value
    let clientErrors = {};
    err.inner.forEach((err) => {
      clientErrors[err.path] = err.errors;
    });

    return res.status(400).json(clientErrors);
  }
};
