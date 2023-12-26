import dotenv from "dotenv";
dotenv.config();

export const dbConfig = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  port: process.env.PORT,
  trustServerCertificate: true,
};
