const { Router } = require("express");
const { body } = require("express-validator");

const usersController = require("../controllers/usersController");

const usersRouter = Router();

// get routes
usersRouter.get("/signup", (req, res) => {
    res.render("signup", { user: req.user });
})

usersRouter.get("/login", (req, res) => {
    res.render("login", { user: req.user });
})


// post routes
usersRouter.post("/signup",
    [
        body("username").isEmail().withMessage("Invalid email"),
        body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),
        body("passwordConfirmation")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Passwords do not match"),
    ],
    usersController.createUser
);

usersRouter.post("/login", usersController.login);
usersRouter.post("/logout", usersController.logout);

module.exports = usersRouter;