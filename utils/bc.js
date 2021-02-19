const { genSalt, hash, compare } = require("bcryptjs");

module.exports.compare = compare;

module.exports.hash = (password) =>
    genSalt().then((salt) => hash(password, salt));
