const spicedPg = require("spiced-pg");

// for the demo, we will "talk" to the cities database you set up this morning
// you will probably want a new database for the petition
// createdb petition
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

module.exports.getAllSign = () => {
    const q = `
        SELECT first, last 
        FROM signatures
    `;
    return db.query(q);
};

module.exports.addSign = (first, last, signature) => {
    const q = `
        INSERT INTO signatures (first, last, signature)
        VALUES ($1, $2, $3)
        RETURNING id
    `;
    const params = [first, last, signature];
    // console.log("q: ", q);
    return db.query(q, params);
};
