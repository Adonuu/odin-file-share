const bcrypt = require("bcryptjs");
require("dotenv").config();

const validPassword = async (password, userPassword) => {
    const match = await bcrypt.compare(password, userPassword);
    return match;
};

const genPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

module.exports = {
    validPassword,
    genPassword
}