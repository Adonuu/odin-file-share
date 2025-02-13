const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const prisma = require("../prisma");
const passport = require("../passport");

const createUser = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            message: "Validation failed", 
            errors: errors.array() 
        });
    }

    try {
        const { username , password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
            }
        });

        res.redirect("/");

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ 
            success: false, 
            message: "An error occurred while creating the user", 
            error: error.message 
        });
    }
};

const login = async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
          console.error(err);
          return res.status(500).render("login", {
            error: "An error occurred during login.",
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
          });
        }
    
        if (!user) {
          return res.status(401).render("login", {
            error: info.message,
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
          });
        }
    
        req.logIn(user, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).render("login", {
              error: "An error occurred during login.",
              isAuthenticated: req.isAuthenticated(),
              user: req.user,
            });
          }
          return res.redirect("/");
        });
    })(req, res, next);
}

const logout = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}

module.exports = { 
    createUser,
    login,
    logout
};
