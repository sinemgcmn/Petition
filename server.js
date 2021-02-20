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
    if (!first || !last || !email || !password) {
        res.render("register", {
            error: true,
            warning: `Houston, we have a problem!!!
                        You should fill out the form!`,
        });
    }
    hash(password).then((hashedPassword) => {
        db.regInputs(first, last, email, hashedPassword).then(({ rows }) => {
            // console.log("rows: ", rows);
            req.session.userId = rows[0].id;
            res.redirect("/petition");
        });
    });
});

////////////LOGIN///////////////////////////

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    const { password, email } = req.body;
    if (!email || !password) {
        res.render("login", {
            error: true,
            warning: `Houston, we have a problem!!!
                        You should fill out the form!`,
        });
    }
    db.selectMail(email).then(({ rows }) => {
        if (rows.length === 0) {
            res.render("login", {
                error: true,
                warning: `This email does not exist`,
            });
        } else if (rows) {
            db.selectPassword(password).then(({ rows }) => {
                hash(password).then((hashedPassword) => {
                    return compare(
                        rows[0].password_hash, // comesfrom db
                        hashedPassword // inputed on page
                    )
                        .then((match) => {
                            if (match) {
                                // succesful login
                                console.log("gir");
                                res.redirect("/petition");
                            } else {
                                /// wrong password alert
                                console.log(hashedPassword);
                                console.log(rows[0].password_hash);
                                console.log(match);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                });
            });
        }
    });
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

//  .catch((err) => {
//     console.log(err);
//     res.render("register", {
//         warning: `Houston, we have a problem!!!
//             You should fill out the form!`,
//     });
// });
