import { extractPageQuery } from "../helperFunctions.js";
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

    res.status(200).send(clientList);
  } catch (e) {
    res.status(500).send({ error: e.messgae });
  }
};

export const getClients = async (req, res) => {
  try {
    let clients = await getClientsService();

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

    let client = await getClientByIdService(id);

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
