import express from "express";
import {
  addClient,
  clientList,
  deleteClient,
  getClientById,
  updateClient,
  validateClient,
} from "../controllers/clientController.js";
import { auth } from "../controllers/userController.js";

const clientRouter = express.Router();

clientRouter.get("/getclientlist", clientList);

clientRouter.post("/addclient", auth, validateClient, addClient);

clientRouter.put("/updateclient/:id", auth, validateClient, updateClient);

clientRouter.post("/deleteclient/:id", auth, deleteClient);

clientRouter.get("/getclientbyid/:id", auth, getClientById);

export default clientRouter;
