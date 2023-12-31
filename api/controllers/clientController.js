import sql from "mssql";
import { extractPageQuery, getTotalCount } from "../helperFunctions.js";
import { Pagination } from "../models/common.js";
import { Client } from "../models/index.js";
import { clientSchema } from "../schema/index.js";

export const clientList = async (req, res) => {
  try {
    let pool = req.db;

    // get page, pageSize from query object
    let { page, pageSize } = extractPageQuery(req.query);

    let result = await pool
      .request()
      .input("PageSize", sql.Int, pageSize)
      .input("PageNumber", sql.Int, page)
      .execute("GetPaginatedClient");

    let totalCount = getTotalCount(result.recordset[0]);

    let paginatedResult = new Pagination(
      result.recordset,
      totalCount,
      page,
      pageSize
    );

    res.status(200).send(paginatedResult);
  } catch (e) {
    res.status(400).send({ error: e.messgae });
  }
};

export const getClients = async (req, res) => {
  try {
    let pool = req.db;

    let result = await pool.request().query(`
      SELECT
        ClientId as id,
        ClientName as name ,
        ClientDescription as description
      FROM
        CLIENTS
      WHERE
        IsActive=1 
      `);

    res.status(200).send(result.recordset);
  } catch (e) {
    res.status(400).send({ error: e.messgae });
  }
};

export const addClient = async (req, res) => {
  try {
    let pool = req.db;
    let { name, description } = req.body;
    let { id } = req.user;

    await pool
      .request()
      .input("ClientName", sql.VarChar, name)
      .input("description", sql.VarChar, description)
      .input("CreatedBy", sql.Int, id)
      .query(
        `INSERT INTO CLIENTS
          (ClientName,
            ClientDescription,
            IsActive,
            CreatedDate,
            CreatedBy)
          VALUES
            (@ClientName,
            @description,
            1,
            GETDATE(),
            @CreatedBy)`
      );

    res.status(201).send({ message: "Client added successfully" });
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
    let userId = req.user.id;

    if (id == 0) {
      throw new Error("Invalid client id");
    }

    await pool
      .request()
      .input("ClientName", sql.VarChar, name)
      .input("description", sql.VarChar, description)
      .input("ModifiedBy", sql.Int, userId)
      .input("ClientId", sql.Int, id)
      .query(
        `UPDATE CLIENTS SET 
          ClientName=@ClientName, 
          ClientDescription=@description,
          ModifiedOn=GETDATE(),
          ModifiedBy=@ModifiedBy
        WHERE 
          ClientId=@ClientId`
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
    let userId = req.user.id;

    if (id == 0) {
      throw new Error("Invalid client id");
    }

    await pool
      .request()
      .input("ModifiedBy", sql.Int, userId)
      .input("ClientId", sql.Int, id)
      .query(
        `UPDATE CLIENTS SET 
          IsActive=0,
          ModifiedOn=GETDATE(),
          ModifiedBy=@ModifiedBy
        WHERE 
         ClientId=@Client`
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

export const validateClient = async (req, res, next) => {
  try {
    let { name, description } = req.body;

    let client = new Client(name, description);

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
