import sql from "mssql";
import { getPool } from "../../config/dbConfig.js";

const pool = getPool();

export const getClientList = async (page, pageSize) => {
  try {
    let result = await pool
      .request()
      .input("PageSize", sql.Int, pageSize)
      .input("PageNumber", sql.Int, page)
      .execute("GetPaginatedClient");

    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getClients = async () => {
  try {
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

    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addClient = async (name, description, id) => {
  try {
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
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateClient = async (name, description, userId, clientId) => {
  await pool
    .request()
    .input("ClientName", sql.VarChar, name)
    .input("description", sql.VarChar, description)
    .input("ModifiedBy", sql.Int, userId)
    .input("ClientId", sql.Int, clientId)
    .query(
      `UPDATE CLIENTS SET 
          ClientName=@ClientName, 
          ClientDescription=@description,
          ModifiedOn=GETDATE(),
          ModifiedBy=@ModifiedBy
        WHERE 
          ClientId=@ClientId`
    );
  try {
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteClient = async (userId, clientId) => {
  try {
    await pool
      .request()
      .input("ModifiedBy", sql.Int, userId)
      .input("ClientId", sql.Int, clientId)
      .query(
        `UPDATE CLIENTS SET 
        IsActive=0,
        ModifiedOn=GETDATE(),
        ModifiedBy=@ModifiedBy
      WHERE 
       ClientId=@ClientId`
      );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getClientById = async (clientId) => {
  try {
    let result = await pool.request().query(
      `SELECT ClientId, ClientName, ClientDescription FROM Clients 
          WHERE 
            IsActive=1 
          AND 
           ClientId=${clientId}`
    );
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
