const prisma = require("../prisma");

const getFiles = async (req, res) => {
    if (!req.user) {
        return res.redirect("/login"); // Ensure user is logged in
    }

    try {
        const files = await prisma.file.findMany({
            where: { userId: req.user.id }, // Fetch only logged-in user's files
            orderBy: { uploadedAt: "desc" }  // Sort by latest uploaded
        });

        res.render("index", { user: req.user, files: files });
    } catch (err) {
        console.error("Error fetching files:", err);
        res.status(500).send("Error loading files.");
    }
}

module.exports = {
    getFiles
}