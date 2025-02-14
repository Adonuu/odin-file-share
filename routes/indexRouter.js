const { Router, application } = require("express");

const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", indexController.getFiles);

module.exports = indexRouter;