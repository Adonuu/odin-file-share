const prisma = require("../prisma");

const createFolder = async (req, res) => {
    const { userId } = req.params;
    const { folderName } = req.body;

    if (!folderName) {
        return res.status(400).send("Folder name is required.");
    }

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Check if folder already exists
        const existingFolder = await prisma.folder.findFirst({
            where: { name: folderName, userId },
        });

        if (existingFolder) {
            return res.status(400).send("Folder already exists.");
        }

        // Create folder in database
        const newFolder = await prisma.folder.create({
            data: { name: folderName, userId },
        });

        res.redirect("/");
    } catch (err) {
        console.error("Error creating folder:", err);
        res.status(500).send("Error creating folder.");
    }
};

const deleteFolder = async (req, res) => {
    const { folderId } = req.params;

    try {
        // Find folder
        const folder = await prisma.folder.findUnique({
            where: { id: folderId },
            include: { files: true },
        });

        if (!folder) {
            return res.status(404).send("Folder not found.");
        }

        // Delete files related to the folder in the database
        await prisma.file.deleteMany({
            where: { folderId: folderId },
        });

        // Delete folder from database
        await prisma.folder.delete({
            where: { id: folderId },
        });

        res.status(200).json({ message: "Folder deleted successfully." });
    } catch (err) {
        console.error("Error deleting folder:", err);
        res.status(500).send("Error deleting folder.");
    }
};

const updateFolderName = async (req, res) => {
    const { folderId } = req.params;
    const { newFolderName } = req.body;

    if (!newFolderName) {
        return res.status(400).send("New folder name is required.");
    }

    try {
        // Find folder
        const folder = await prisma.folder.findUnique({
            where: { id: folderId },
        });

        if (!folder) {
            return res.status(404).send("Folder not found.");
        }

        // Update folder name in database
        const updatedFolder = await prisma.folder.update({
            where: { id: folderId },
            data: { name: newFolderName },
        });

        res.status(200).json({ message: "Folder name updated successfully.", folder: updatedFolder });
    } catch (err) {
        console.error("Error updating folder name:", err);
        res.status(500).send("Error updating folder name.");
    }
};

const getFilesInFolder = async (req, res) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    
    const { folderId } = req.params;
    
    try {
        const folder = await prisma.folder.findFirst({
            where: { id: folderId, userId: req.user.id }
        });

        if (!folder) {
            return res.status(404).send("Folder not found.");
        }

        const files = await prisma.file.findMany({
            where: { folderId: folderId, userId: req.user.id },
            orderBy: { uploadedAt: "desc" }
        });

        res.render("viewFolder", { files, folder });
    } catch (err) {
        console.error("Error fetching files in folder:", err);
        res.status(500).send("Error loading files in folder.");
    }
};

const createFile = async (req, res) => {
    const { folderId } = req.params; // Get folderId from request params

    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    try {
        // Check if folder exists and belongs to the logged-in user
        const folder = await prisma.folder.findFirst({
            where: { id: folderId, userId: req.user.id }, // Ensure folder belongs to the logged-in user
        });

        if (!folder) {
            return res.status(404).send("Folder not found or you don't have permission to access it.");
        }

        // Save file details and associate it with the folder and user
        const newFile = await prisma.file.create({
            data: {
                filename: req.file.filename,
                fileType: req.file.mimetype,
                filePath: req.file.path,
                folderId: folderId,  // Associate the file with the folder
                userId: req.user.id, // Associate the file with the user
                uploadedAt: new Date(),
            },
        });

        // Redirect to the folder's page to view the uploaded file
        res.redirect(`/folder/view/${folderId}`);
    } catch (err) {
        console.error("Error uploading file:", err);
        res.status(500).send("Error saving file details.");
    }
};

const getFolderById = async (req, res) => {
    const { folderId } = req.params;

    try {
        // Find the folder by folderId and ensure it belongs to the logged-in user
        const folder = await prisma.folder.findFirst({
            where: { id: folderId, userId: req.user.id }, // Ensure folder belongs to the logged-in user
        });

        if (!folder) {
            return res.status(404).send("Folder not found or you don't have permission to access it.");
        }

        res.render("uploadToFolder", { user : req.user, folder });
    } catch (err) {
        console.error("Error fetching folder:", err);
        res.status(500).send("Error fetching folder.");
    }
};


module.exports = {
    createFolder,
    deleteFolder,
    updateFolderName,
    getFilesInFolder,
    createFile,
    getFolderById
};
