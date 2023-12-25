import sql from "mssql";

export const ProjectList = async (req, res) => {
  try {
    let pool = req.db;
    let result = await pool.request().query(
      `SELECT * FROM Projects 
          WHERE 
        IsActive=1`
    );
    res.send(result.recordset);
  } catch (e) {
    res.status(400).send({ error: e.messgae });
  }
};

export const getProjects = async (req, res) => {};

export const addProject = async (req, res) => {
  try {
    let pool = req.db;
    let { projectName, projectDescription, clientId } = req.body;

    await pool
      .request()
      .input("projectName", sql.VarChar, projectName)
      .input("projectDescription", sql.VarChar, projectDescription)
      .input("clientId", sql.Int, clientId)
      .query(
        `INSERT INTO PROJECTS 
          (ProjectName, 
          ProjectDescription, 
          ClientId,  
          IsActive, 
          CreatedDate, 
          ModifiedDate) 
        VALUES 
          (@ProjectName, 
            @ProjectDescription, 
            @ClientId, 
            1, 
            GETDATE(), 
            GETDATE())`
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

    if (id == 0) {
      throw new Error("Invalid project id");
    }

    await pool
      .request()
      .input("ProjectName", sql.VarChar, projectName)
      .input("ProjectDescription", sql.VarChar, projectDescription)
      .input("ClientId", sql.Int, clientId)
      .input("ProjectId", sql.Int, id)
      .query(
        `UPDATE PROJECTS SET 
          ProjectName=@ProjectName, 
          ProjectDescription=@ProjectDescription, 
          ClientId=@ClientId 
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

    if (id == 0) {
      throw new Error("Invalid project id");
    }

    await pool
      .request()
      .input("ProjectId", sql.Int, id)
      .query(
        `UPDATE PROJECTS SET 
          IsActive=0 
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
