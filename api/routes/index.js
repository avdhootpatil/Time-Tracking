import express from "express";

const indexRouter = express.Router();

indexRouter.get("/", function (req, res) {
  res.redirect("/client");
});

export default indexRouter;
