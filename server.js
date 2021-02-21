const express = require("express");
const app = express();

const db = require("./db");

const hb = require("express-handlebars");

const { hash, compare } = require("./utils/bc.js");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: false }));
const cookieSession = require("cookie-session");
app.use(
    cookieSession({
        secret: `Hey this is my cookie-secret.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
app.use(express.static("public"));

////////////REGISTRATION///////////////////////////

app.get("/register", (req, res) => {
    if (!req.session.userId && !req.session.signatureId) {
        res.render("register");
    } else {
        res.redirect("/thanks");
    }
});

app.post("/register", (req, res) => {
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
            req.session.userId = rows[0].id;
            res.redirect("/profile");
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
    db.selectPasswordAndMail(email).then(({ rows }) => {
        if (rows.length === 0) {
            res.render("login", {
                error: true,
                warning: `This email does not exist`,
            });
        } else if (rows) {
            compare(password, rows[0].password_hash).then((match) => {
                if (match) {
                    // successsful login
                    req.session.userId = rows[0].id;

                    db.getSign(req.session.userId).then(({ rows }) => {
                        if (rows.length === 0) {
                            res.redirect("/petition");
                        } else {
                            res.redirect("/thanks");
                        }
                    });
                } else {
                    res.render("login", {
                        warning: `Houston, we have a problem!!!
                            Password doesn't match!!!`,
                    });
                }
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

app.post("/petition", (req, res) => {
    const { signature } = req.body;

    db.addSign(req.session.userId, signature)
        .then(({ rows }) => {
            req.session.signatureId = rows[0].id;
            res.redirect("/thanks");
        })
        .catch((err) => {
            console.log(err);
            res.render("petition", {
                warning: `Houston, we have a problem!!!
                        You should fill out the form!`,
            });
        });
});

////////////THANKS///////////////////////////////

app.get("/thanks", (req, res) => {
    db.getNum()
        .then(({ rows }) => {
            console.log(rows);
            let signersNum = rows;
            console.log(signersNum);
            // console.log("signerNum:", signersNum);
            db.getSign(req.session.signatureId)
                .then(({ rows }) => {
                    let signs = rows;
                    console.log("sdsd", req.session.signatureId);
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
    db.getAllSign()
        .then(({ rows }) => {
            let allSignInfo = rows;
            res.render("signers", { allSignInfo });
        })
        .catch((err) => console.log(err));
});

//////////////PROFILE/////////////////////////////

app.get("/profile", (req, res) => {
    res.render("profile");
});

app.post("/profile", (req, res) => {
    const { age, city, homepage } = req.body;
    let urltoInsert = homepage;
    if (
        !urltoInsert.startsWith("http://") &&
        !urltoInsert.startsWith("https://")
    ) {
        urltoInsert = "https://" + urltoInsert;
    }
    db.reqUserInfo(age, city, urltoInsert, req.session.userId).then(
        ({ rows }) => {
            console.log("rows: ", rows);
            req.session.userId = rows[0].userid;
            res.redirect("/login"); ////???
        }
    );
});

app.get("/signers/:city/", (req, res) => {
    // const city = req.params.city;
    // console.log(city);
});

app.listen(8080, () => console.log("Petition up and running...."));
