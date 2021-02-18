//petes lesson
const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: false }));
app.use(
    cookieSession({
        secret: `Hey this is my cookie-secret.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
app.use(express.static("public"));

app.get("/", (req, res) => {
    if (req.session.signatureId) {
        res.redirect("/thanks");
    } else {
        res.render("petition");
    }
});

app.post("/", (req, res) => {
    const { firstname, lastname, signature, accept } = req.body;
    if (accept) {
        db.addSign(req.body.firstname, req.body.lastname, req.body.signature)
            .then(({ rows }) => {
                console.log("rows: ", rows);
                req.session.signatureId = rows[0].id;
                res.redirect("/thanks");
            })
            .catch((err) => {
                res.render("petition", {
                    warning: `Houston, we have a problem!!! 
                        You should fill out the form!`,
                });
            });
    }
});

app.get("/thanks", (req, res) => {
    if (req.session.signatureId) {
        db.getAllSign()
            .then(({ rowCount }) => {
                console.log("rowCount: ", rowCount);
                const signersNum = rowCount;
                res.render("thanks", { signersNum });
            })
            .catch((err) => console.log(err));
    } else {
        res.redirect("/");
    }
});

app.get("/signers", (req, res) => {
    if (!req.session.signatureId) {
        res.redirect("/");
    } else {
        db.getAllSign()
            .then(({ rows, rowCount }) => {
                console.log("rows and rowCount: ", rows, rowCount);
                const signersData = rows;
                res.render("signers", { signersData, rowCount });
            })
            .catch((err) => console.log(err));
    }
});

app.listen(8080, () => console.log("Petition up and running...."));
