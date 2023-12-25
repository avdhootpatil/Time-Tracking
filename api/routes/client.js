import express from "express";
import {
  addClient,
  clientList,
  deleteClient,
  getClientById,
  updateClient,
} from "../controllers/clientController.js";

const clientRouter = express.Router();

clientRouter.get("/getclientlist", clientList);

clientRouter.post("/addclient", addClient);

clientRouter.put("/updateclient/:id", updateClient);

clientRouter.post("/deleteclient/:id", deleteClient);

clientRouter.get("/getclientbyid/:id", getClientById);

export default clientRouter;
