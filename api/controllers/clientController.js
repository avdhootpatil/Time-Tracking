import sql from "mssql";
import { Client } from "../models/index.js";
import { clientSchema } from "../schema/index.js";

export const clientList = async (req, res) => {
  try {
    let pool = req.db;
    let result = await pool
      .request()
      .query("SELECT * FROM Clients WHERE IsActive=1");
    res.send(result.recordset);
  } catch (e) {
    res.status(400).send({ error: e.messgae });
  }
};

export const addClient = async (req, res) => {
  try {
    let pool = req.db;
    let { name, description } = req.body;

    await pool
      .request()
      .input("ClientName", sql.VarChar, name)
      .input("description", sql.VarChar, description)
      .query(
        `INSERT INTO
        Clients
          (ClientName,
            ClientDescription,
            IsActive,
            CreatedDate,
            ModifiedOn)
          VALUES
            (@ClientName,
            @description,
            1,
            GETDATE(),
            GETDATE())`
      );

    res.status(201).json({ message: "Client added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    let pool = req.db;

    let { id } = req.params;
    let { name, description } = req.body;

    if (id == 0) {
      throw new Error("Invalid client id");
    }

    await pool.request().query(
      `UPDATE CLIENTS SET 
          ClientName='${name}', 
          ClientDescription='${description}' 
        WHERE 
          ClientId=${id} `
    );

    res.status(201).send({ message: "Client updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    let pool = req.db;
    let { id } = req.params;

    if (id == 0) {
      throw new Error("Invalid client id");
    }

    await pool.request().query(
      `UPDATE CLIENTS SET 
          IsActive=0 
        WHERE 
         ClientId=${id} `
    );

    res.status(201).send({ message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const getClientById = async (req, res) => {
  try {
    let pool = req.db;
    let { id } = req.params;

    let result = await pool.request().query(
      `SELECT * FROM Clients 
        WHERE 
          IsActive=1 
        AND 
         ClientId=${id}`
    );
    res.send(result.recordset);
  } catch (e) {
    res.status(400).send({ error: e });
  }
};

export const validateClient = (req, res, next) => {
  let { name, description } = req.body;

  let client = new Client(name, description);

  const { error } = clientSchema.validate(client, {
    abortEarly: false,
  });

  if (error) {
    // add errors in object with key as prop name and value as prop value
    let clientErrors = {};
    error.details.map((detail) => {
      clientErrors[detail.context.key] = [detail.message];
    });

    return res.status(400).json(clientErrors);
  }

  next();
};
