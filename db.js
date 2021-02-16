const spicedPg = require("spiced-pg");

// for the demo, we will "talk" to the cities database you set up this morning
// you will probably want a new database for the petition
// createdb petition
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

module.exports.getAllCities = () => {
    const q = `
        SELECT *
        FROM signatures
    `;
    return db.query(q);
};
