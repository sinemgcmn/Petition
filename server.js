//petes lesson
const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const cookieParser = require("cookie-parser");
// console.log("db: ", db);

app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

// IF the user has already signed the petition, it redirects to /thanks
// IF user has not yet signed, it renders petition.handlebars template
app.get("/", (req, res) => {
    if (req.cookies.authenticated) {
        res.redirect("/thanks");
    } else {
        res.render("petition");
    }
});

//runs when the user submits their signature, i.e. clicks submit
// INSERT all data to submit into a designated table into your database,
// IF there is no error
// set cookie to remember
// redirect to thank you page
app.post("/", (req, res) => {
    // console.log("req.body: ", req.body);
    const { first, last, signature, accept } = req.body;
    db.addSign(req.body.first, req.body.last, req.body.signature)
        .then((result) => {
            console.log("result: ", result);
        })
        .catch((err) => console.log(err));
    if (accept) {
        res.cookie("authenticated", "true");
        res.redirect("/thanks");
    }
});

//renders the thanks.handlebars template
//However this should only be visible to those that have signed,
app.get("/thanks", (req, res) => {
    if (req.cookies.authenticated) {
        res.render("thanks");
    } else {
        res.redirect("/");
    }
});

//redirect users to /petition if there is no cookie
//SELECT first and last values of every person that has signed from the database and pass them to signers.handlebars

app.get("/signers", (req, res) => {
    const signersData = db
        .getAllSign()
        .then(({ rows }) => {
            console.log("rows: ", rows);
        })
        .catch((err) => console.log(err));
    if (!req.cookies.authenticated) {
        res.redirect("/");
    } else {
        res.render("signers", { signersData });
    }
});

app.listen(8080, () => console.log("Petition up and running...."));
