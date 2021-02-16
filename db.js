const spicedPg = require("spiced-pg");

// for the demo, we will "talk" to the cities database you set up this morning
// you will probably want a new database for the petition
// createdb petition
const db = spicedPg("postgres:postgres:postgres@localhost:5432/cities");

module.exports.getAllCities = () => {
    const q = `
        SELECT *
        FROM cities
    `;
    return db.query(q);
};

module.exports.addCity = (city, country, population) => {
    const q = `
        INSERT INTO cities (city, country, population)
        VALUES ($1, $2, $3)
        RETURNING id
    `;
    const params = [city, country, population];
    // console.log("q: ", q);
    return db.query(q, params);
};
