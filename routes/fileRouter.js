const { Router } = require("express");
const upload = require("../multer");

const fileController = require("../controllers/fileController");

const fileRouter = Router();

// get routes
fileRouter.get("/upload", (req, res) => {
    res.render("upload", { user: req.user });
})

// post routes
fileRouter.post("/upload/:userId", upload.single("file"), fileController.createFile);

module.exports = fileRouter;