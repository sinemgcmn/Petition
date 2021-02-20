const { genSalt, hash, compare } = require("bcryptjs");

// Export the Methods We Will Need ---------------------------------------------
module.exports.compare = compare;

module.exports.hash = (password) =>
    genSalt().then((salt) => hash(password, salt));
