//petes lesson
const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
// console.log("db: ", db);

app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("petition");
});

// petes code
db.getAllSign()
    .then(({ rows }) => {
        console.log("rows: ", rows);
    })
    .catch((err) => console.log(err));

db.addSign("sinem", "gocmen", "signed")
    .then(({ rows }) => {
        console.log("rows: ", rows);
    })
    .catch((err) => console.log(err));

app.listen(8080, () => console.log("Petition up and running...."));
