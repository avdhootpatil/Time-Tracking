import sql from "mssql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const checkEmail = async (req, res, next) => {
  try {
    let pool = req.db;

    let { userEmail } = req.body;

    let result = await pool.request().input("UserEmail", sql.VarChar, userEmail)
      .query(`
    SELECT *
    FROM USERS
    WHERE UserEmail = @UserEmail;
    `);

    //check type
    let type = req.url.split("/")[1];

    if (type === "register") {
      if (result.recordset.length) {
        return res
          .status(409)
          .send({ message: "This email is already in use." });
      } else {
        next();
      }
    }

    if (type === "login") {
      if (result.recordset.length) {
        req.user = result.recordset[0];
        next();
      } else {
        return res.status(404).send({ message: "Email does not exist" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Unable to check email." });
  }
};

export const registerUser = async (req, res) => {
  try {
    let pool = req.db;

    let { userName, userEmail, password } = req.body;

    let hashedPassword = await bcrypt.hash(password, 10);

    if (hashedPassword) {
      await pool
        .request()
        .input("userName", sql.VarChar, userName)
        .input("UserEmail", sql.VarChar, userEmail)
        .input("Password", sql.VarChar, hashedPassword).query(`
        INSERT INTO USERS
        (UserName, 
          UserEmail, 
          UserPassword, 
          IsActive)
          VALUES
          (@UserName, 
              @UserEmail,
              @Password,
              1)`);
      res.status(201).send({ message: "User created successfully" });
    } else {
      throw new Error("Password not hashed succussfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    let { password } = req.body;
    let { user } = req;

    let isPasswordMatched = await bcrypt.compare(
      password,
      req.user.UserPassword
    );

    if (isPasswordMatched) {
      //sign  the json token and send it the client
      let secretKey = process.env.SECRET_KEY;
      let token = jwt.sign({ id: req.user.id }, secretKey, { expiresIn: "1d" });

      //delete the password from request
      delete req.user.password;

      //send the token to the user
      res.status(201).send({
        id: user.UserId,
        email: user.UserEmail,
        token,
      });
    } else {
      res.status(401).send({ message: "Password doe not match" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Unable to login, please try again." });
  }
};
