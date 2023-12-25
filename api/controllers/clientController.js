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

    await pool.request().query(
      `INSERT INTO 
        Clients 
          (ClientName,
            ClientDescription, 
            IsActive, 
            CreatedDate, 
            ModifiedOn) 
          VALUES 
            ('${name}', '
            ${description}', 
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
