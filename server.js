const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const { hash, compare } = require("./utils/bc.js");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(
    cookieSession({
        secret: `Hey this is my cookie-secret.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(csurf());
app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});

////////////REGISTRATION///////////////////////////

app.get("/", (req, res) => {
    res.redirect("/register");
});

app.get("/register", (req, res) => {
    if (!req.session.userId && !req.session.signatureId) {
        res.render("register");
    } else if (req.session.userId && !req.session.signatureId) {
        res.redirect("/petition");
    } else if (req.session.userId && req.session.signatureId) {
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
                    // console.log(req.session.userId);
                    db.getSign(req.session.userId).then(({ rows }) => {
                        if (rows.length === 0) {
                            res.redirect("/petition");
                        } else {
                            req.session.signatureId = rows[0].id;
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
    if (!req.session.userId && !req.session.signatureId) {
        res.redirect("/register");
    } else if (req.session.userId && req.session.signatureId) {
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
            res.redirect("/thanks"); //////????????????
        })
        .catch((err) => {
            res.render("petition", {
                warning: `Houston, we have a problem!!!
                        You should fill out the form!`,
            });
        });
});

////////////THANKS///////////////////////////////

app.get("/thanks", (req, res) => {
    if (!req.session.userId && !req.session.signatureId) {
        res.redirect("/register");
    } else if (!req.session.signatureId) {
        res.redirect("/petition");
    } else if (req.session.userId && req.session.signatureId) {
        db.getNum()
            .then(({ rows }) => {
                let signersNum = rows;
                db.getSign(req.session.userId)
                    .then(({ rows }) => {
                        let signs = rows;
                        res.render("thanks", {
                            signersNum,
                            signs,
                        });
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    }
});

////////////SIGNERS///////////////////////////////

app.get("/signers", (req, res) => {
    if (!req.session.userId && !req.session.signatureId) {
        res.redirect("/register");
    } else if (!req.session.signatureId) {
        res.redirect("/petition");
    } else if (req.session.userId && req.session.signatureId) {
        db.getAllSign()
            .then(({ rows }) => {
                let allSignInfo = rows;
                res.render("signers", { allSignInfo });
            })
            .catch((err) => console.log(err));
    }
});

//////////////PROFILE/////////////////////////////

app.get("/profile", (req, res) => {
    if (!req.session.userId && !req.session.signatureId) {
        res.redirect("/register");
    } else {
        res.render("profile");
    }
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
            req.session.userId = rows[0].userid;
            res.redirect("/login");
        }
    );
});

app.get("/signers/:city/", (req, res) => {
    if (!req.session.userId && !req.session.signatureId) {
        res.redirect("/register");
    } else if (!req.session.signatureId) {
        res.redirect("/petition");
    } else {
        const city = req.params.city;
        db.signersByCity(city)
            .then(({ rows }) => {
                let allCityInfo = rows;
                res.render("city", { allCityInfo });
            })
            .catch((err) => console.log(err));
    }
});

////////////////EDIT/////////////////////////////////

app.get("/profile/edit", (req, res) => {
    db.getInfoEdit(req.session.userId).then(({ rows }) => {
        let allEditInfo = rows;
        res.render("edit", { allEditInfo });
    });
});

app.post("/profile/edit", (req, res) => {
    if (req.body.password === "") {
        db.updateUserWithoutPassword(
            req.body.first,
            req.body.last,
            req.session.userId,
            req.body.email
        );
        db.updateProfileWithoutPassword(
            req.body.age,
            req.body.city,
            req.body.homepage,
            req.session.userId
        );
    } else {
        db.getPasswordwithId(req.session.userId).then(({ rows }) => {
            compare(req.body.password, rows[0].password_hash).then((match) => {
                if (!match) {
                    hash(req.body.password).then((hashedPassword) => {
                        db.updatePassword(req.session.userId, hashedPassword);
                    });
                }
            });
        });
    }
    res.render("edit", {
        message: `We successfully updated your profile!!!`,
    });
});

/////////////////SIGNATURE DELETE///////////////////
app.post("/thanks", (req, res) => {
    const userId = req.session.userId;

    if (req.body.button == "deleteSig") {
        db.deleteSign(userId);
        delete req.session.signatureId;
        res.redirect("/petition");
    } else if (req.body.button == "logoutUser") {
        delete req.session.signatureId;
        delete req.session.userId;
        res.redirect("/login");
    } else if (req.body.button == "deleteAcc") {
        db.forgetUserSignature(userId);
        db.forgetUserProfile(userId);
        db.forgetUserId(userId);
        delete req.session.signatureId;
        delete req.session.userId;
        res.redirect("/register");
    }
});

/////////////////LOGOUT////////////////////////////

app.listen(process.env.PORT || 8080, () =>
    console.log("Petition up and running....")
);
