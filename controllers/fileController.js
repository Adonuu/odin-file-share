const prisma = require("../prisma");

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
}

module.exports = {
    createFile
}