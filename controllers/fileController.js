const prisma = require("../prisma");
const path = require("path");

const createFile = async (req, res) => {
    const { userId } = req.params;

    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Save file details in Prisma with user reference
        const newFile = await prisma.file.create({
            data: {
                filename: req.file.filename,
                fileType: req.file.mimetype,
                filePath: req.file.path,
                userId: userId, // Associate file with user
            },
        });

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving file details.");
    }
};

// Download File Function
const downloadFile = async (req, res) => {
    const { fileId } = req.params;

    try {
        // Find the file in the database
        const file = await prisma.file.findUnique({
            where: { id: fileId },
        });

        if (!file) {
            return res.status(404).send("File not found.");
        }

        // Construct full file path
        const filePath = path.join(__dirname, "..", file.filePath);

        // Send file for download
        res.download(filePath, file.filename, (err) => {
            if (err) {
                console.error("Error downloading file:", err);
                res.status(500).send("Error downloading file.");
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving file.");
    }
};

module.exports = {
    createFile,
    downloadFile
};
