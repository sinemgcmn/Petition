exports.requireLoggedInUser = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect("/register");
    } else {
        next();
    }
};

exports.requireLoggedOutUser = (req, res, next) => {
    if (req.session.userId) {
        res.redirect("/petition");
    } else {
        next();
    }
};

exports.requireNoSignature = (req, res, next) => {
    if (req.session.signatureId) {
        return res.redirect("/thanks");
    }
    next();
};

exports.requireSignature = (req, res, next) => {
    if (!req.session.signatureId) {
        return res.redirect("/petition");
    }
    next();
};
