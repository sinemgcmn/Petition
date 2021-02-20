// const { genSalt, hash, compare } = require("bcryptjs");

// module.exports.compare = compare;

// const saltRounds = 10;

// module.exports.hash = (password, salt_input) =>
//     genSalt(saltRounds).then((salt) => hash(password, salt));

const { genSalt, hash, compare } = require("bcryptjs");

// Export the Methods We Will Need ---------------------------------------------
module.exports.compare = compare;

module.exports.hash = (password) =>
    genSalt().then((salt) => hash(password, salt));
