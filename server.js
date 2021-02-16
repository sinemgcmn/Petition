//petes lesson
const express = require("express");
const app = express();
const db = require("./db-enc");

console.log("db: ", db);

app.use(express.static("public"));

db.addCity("New York", "USA", 11000000)
    .then(({ rows }) => {
        console.log("rows: ", rows);
    })
    .catch((err) => console.log(err));

// db.getAllCities()
//     .then(({ rows }) => {
//         console.log("rows: ", rows);
//     })
//     .catch((err) => console.log(err));

app.listen(8080, () => console.log("Petition up and running...."));
