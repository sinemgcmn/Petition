//petes lesson
const express = require("express");
const app = express();
const db = require("./db");

console.log("db: ", db);

app.use(express.static("public"));

db.getAllCities()
    .then(({ rows }) => {
        console.log("rows: ", rows);
    })
    .catch((err) => console.log(err));

app.listen(8080, () => console.log("Petition up and running...."));
