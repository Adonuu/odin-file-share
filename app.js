const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const passport = require("./passport");

const session = require("express-session");
const sessionConfig = require("./session");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

const usersRouter = require("./routes/usersRouter");
app.use("/users", usersRouter);

const fileRouter = require("./routes/fileRouter");
app.use("/file", fileRouter);

const folderRouter = require("./routes/folderRouter");
app.use("/folder", folderRouter);

const indexRouter = require("./routes/indexRouter");
app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));