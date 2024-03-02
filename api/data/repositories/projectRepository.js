import sql from "mssql";
import { getPool } from "../../config/dbConfig.js";

const pool = getPool();

export const projectList = async (page, pageSize) => {
  try {
    let result = await pool
      .request()
      .input("PageSize", sql.Int, pageSize)
      .input("PageNumber", sql.Int, page)
      .execute("GetPaginatedProjects");
    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProjects = async () => {
  try {
    let result = await pool.request().execute("GetProjects");
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addProject = async (
  projectName,
  projectDescription,
  clientId,
  userId
) => {
  try {
    await pool
      .request()
      .input("projectName", sql.VarChar, projectName)
      .input("projectDescription", sql.VarChar, projectDescription)
      .input("clientId", sql.Int, clientId)
      .input("CreatedBy", sql.Int, userId)
      .query(
        `INSERT INTO PROJECTS 
        (ProjectName, 
        ProjectDescription, 
        ClientId,  
        IsActive, 
        CreatedDate, 
        CreatedBy) 
      VALUES 
        (@ProjectName, 
          @ProjectDescription, 
          @ClientId, 
          1, 
          GETDATE(), 
          @CreatedBy)`
      );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateProject = async (
  projectName,
  projectDescription,
  clientId,
  projectId,
  userId
) => {
  try {
    await pool
      .request()
      .input("ProjectName", sql.VarChar, projectName)
      .input("ProjectDescription", sql.VarChar, projectDescription)
      .input("ClientId", sql.Int, clientId)
      .input("ProjectId", sql.Int, projectId)
      .input("ModifiedBy", sql.Int, userId)
      .query(
        `UPDATE PROJECTS SET 
        ProjectName=@ProjectName, 
        ProjectDescription=@ProjectDescription, 
        ClientId=@ClientId,
        ModifiedDate=GETDATE(),
        ModifiedBy=@ModifiedBy
      WHERE 
        ProjectId=@ProjectId`
      );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteProject = async (projectId, userId) => {
  try {
    await pool
      .request()
      .input("ProjectId", sql.Int, projectId)
      .input("ModifiedBy", sql.Int, userId)
      .query(
        `UPDATE PROJECTS SET 
        IsActive=0,
        ModifiedDate=GETDATE(),
        ModifiedBy=@ModifiedBy
      WHERE 
        ProjectId=@ProjectId `
      );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProjectById = async (projectId) => {
  try {
    let result = await pool
      .request()
      .input("ProjectId", sql.Int, projectId)
      .execute("GetProjectById");
    return result.recordset[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
