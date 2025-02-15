const prisma = require("../prisma");

const getFilesAndFolders = async (req, res) => {
    if (!req.user) {
        return res.redirect("/login"); // Ensure user is logged in
    }

    try {
        // Run both the file and folder queries concurrently using Promise.all
        const [files, folders] = await Promise.all([
            prisma.file.findMany({
                where: { userId: req.user.id },
                orderBy: { uploadedAt: "desc" }
            }),
            prisma.folder.findMany({
                where: { userId: req.user.id },
                orderBy: { createdAt: "desc" }
            })
        ]);

        res.render("index", { user: req.user, files, folders });
    } catch (err) {
        console.error("Error fetching files and folders:", err);
        res.status(500).send("Error loading files and folders.");
    }
};

module.exports = {
    getFilesAndFolders,
};
