const { Router } = require("express");
const upload = require("../multer");

const folderController = require("../controllers/folderController");
const { folder } = require("../prisma");

const folderRouter = Router();

// get routes
folderRouter.get("/create", (req, res) => {
    res.render("createFolder", { user: req.user });
});

folderRouter.get("/upload/:folderId", folderController.getFolderById)

folderRouter.get("/view/:folderId", folderController.getFilesInFolder);

// post routes
folderRouter.post("/create/:userId", folderController.createFolder);
folderRouter.post("/delete/:folderId", folderController.deleteFolder);
folderRouter.post("/update/:folderId", folderController.updateFolderName);
folderRouter.post("/upload/:folderId", upload.single("file"), folderController.createFile);

module.exports = folderRouter;