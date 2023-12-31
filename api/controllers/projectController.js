import sql from "mssql";
import { extractPageQuery, getTotalCount } from "../helperFunctions.js";
import { Pagination } from "../models/common.js";
import { Project } from "../models/index.js";
import { projectSchema } from "../schema/index.js";

export const ProjectList = async (req, res) => {
  try {
    let pool = req.db;

    // get page, pageSize from query object
    let { page, pageSize } = extractPageQuery(req.query);

    let result = await pool
      .request()
      .input("PageSize", sql.Int, pageSize)
      .input("PageNumber", sql.Int, page)
      .execute("GetPaginatedProjects");

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

export const getProjects = async (req, res) => {
  try {
    let pool = req.db;

    let result = await pool.request().query(`
      SELECT
        ProjectId as id,
        ProjectName as name ,
        ProjectDescription as description
      FROM
        PROJECTS
      WHERE
        IsActive=1 
      `);

    res.status(200).send(result.recordset);
  } catch (e) {
    res.status(400).send({ error: e.messgae });
  }
};

export const addProject = async (req, res) => {
  try {
    let pool = req.db;
    let { projectName, projectDescription, clientId } = req.body;
    let { id } = req.user;

    await pool
      .request()
      .input("projectName", sql.VarChar, projectName)
      .input("projectDescription", sql.VarChar, projectDescription)
      .input("clientId", sql.Int, clientId)
      .input("CreatedBy", sql.Int, id)
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

    res.status(201).json({ message: "Project added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    let pool = req.db;

    let { id } = req.params;
    let { projectName, projectDescription, clientId } = req.body;
    let userId = req.user.id;

    if (id == 0) {
      throw new Error("Invalid project id");
    }

    await pool
      .request()
      .input("ProjectName", sql.VarChar, projectName)
      .input("ProjectDescription", sql.VarChar, projectDescription)
      .input("ClientId", sql.Int, clientId)
      .input("ProjectId", sql.Int, id)
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

    res.status(201).send({ message: "Project updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    let pool = req.db;
    let { id } = req.params;
    let userId = req.user.id;

    if (id == 0) {
      throw new Error("Invalid project id");
    }

    await pool
      .request()
      .input("ProjectId", sql.Int, id)
      .input("ModifiedBy", sql.Int, userId)
      .query(
        `UPDATE PROJECTS SET 
          IsActive=0,
          ModifiedDate=GETDATE(),
          ModifiedBy=@ModifiedBy
        WHERE 
          ProjectId=@ProjectId `
      );

    res.status(201).send({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    let pool = req.db;
    let { id } = req.params;

    let result = await pool
      .request()
      .input("ProjectId", sql.Int, id)
      .query(
        `SELECT * FROM PROJECTS 
        WHERE 
          IsActive=1 
        AND 
          ProjectId=@ProjectId`
      );
    res.send(result.recordset);
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }
};

export const validateProject = async (req, res, next) => {
  try {
    let { projectName, projectDescription, clientId } = req.body;

    let project = new Project(projectName, projectDescription, clientId);

    await projectSchema.validate(project, { abortEarly: false });

    next();
  } catch (err) {
    // add errors in object with key as prop name and value as prop value

    let projectErrors = {};
    err.inner.forEach((err) => {
      projectErrors[err.path] = err.errors;
    });

    return res.status(400).json(projectErrors);
  }
};
