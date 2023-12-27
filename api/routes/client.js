import express from "express";
import {
  addClient,
  clientList,
  deleteClient,
  getClientById,
  updateClient,
  validateClient,
} from "../controllers/clientController.js";

const clientRouter = express.Router();

clientRouter.get("/getclientlist", clientList);

clientRouter.post("/addclient", validateClient, addClient);

clientRouter.put("/updateclient/:id", validateClient, updateClient);

clientRouter.post("/deleteclient/:id", deleteClient);

clientRouter.get("/getclientbyid/:id", getClientById);

export default clientRouter;
