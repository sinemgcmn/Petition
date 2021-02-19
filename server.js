const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const { hash, compare } = require("./utils/bc.js");
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

////////////REGISTRATION///////////////////////////

app.get("/", (req, res) => {
    res.render("register");
});

app.post("/", (req, res) => {
    const { first, last, email, password } = req.body;
    hash(password).then((hashedPassword) => {
        db.regInputs(first, last, email, hashedPassword)
            .then(({ rows }) => {
                console.log("rows: ", rows);
                req.session.userId = rows[0].id;
                res.redirect("/petition");
            })
            .catch((err) => {
                console.log(err);
                res.render("petition", {
                    warning: `Houston, we have a problem!!!
                        You should fill out the form!`,
                });
            });
    });
});

////////////LOGIN///////////////////////////

app.get("/login", (req, res) => {
    res.render("login");
});

////////////PETITION///////////////////////////////
app.get("/petition", (req, res) => {
    if (req.session.signatureId) {
        res.redirect("/thanks");
    } else {
        res.render("petition");
    }
});

// app.post("/petition", (req, res) => {
//     const { signature, accept } = req.body;
//     if (accept) {
//         db.addSign(req.body.signature)
//             .then(({ rows }) => {
//                 // console.log("rows: ", rows);
//                 req.session.signatureId = rows[0].id;
//                 res.redirect("/thanks");
//             })
//             .catch((err) => {
//                 console.log(err);
//                 res.render("petition", {
//                     warning: `Houston, we have a problem!!!
//                         You should fill out the form!`,
//                 });
//             });
//     }
// });

////////////THANKS///////////////////////////////

app.get("/thanks", (req, res) => {
    db.getNum()
        .then(({ rows }) => {
            let signersNum = rows;
            console.log(signersNum);
            // console.log("signerNum:", signersNum);
            db.getSign(req.session.signatureId)
                .then(({ rows }) => {
                    let signs = rows;
                    console.log(signs);
                    res.render("thanks", {
                        signersNum,
                        signs,
                    });
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
});

////////////SIGNERS///////////////////////////////

app.get("/signers", (req, res) => {
    if (!req.session.signatureId) {
        res.redirect("/");
    } else {
        db.getAllSign()
            .then(({ rows }) => {
                // console.log("rows: ", rows);
                const signersData = rows;
                res.render("signers", { signersData });
            })
            .catch((err) => console.log(err));
    }
});

app.listen(8080, () => console.log("Petition up and running...."));

//    if (!first || !last || !email || password) {
//        res.render("register", {
//            warning: `Houston, we have a problem!!!
//                         You should fill out the form!`,
//        });
//    }
