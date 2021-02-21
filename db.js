const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

////////PART 1/////////////////

module.exports.getAllSign = () => {
    const q = `
        SELECT users.first_name, users.last_name, 
            user_profiles.age, user_profiles.city, 
            user_profiles.url
        FROM signatures 
        LEFT JOIN users ON (signatures.userid = users.id)
        LEFT JOIN user_profiles ON (signatures.userid = user_profiles.userid)
    `;

    return db.query(q);
};

module.exports.getNum = () => {
    const q = `
        SELECT COUNT(*) 
        FROM signatures
    `;

    return db.query(q);
};

module.exports.getSign = (id) => {
    const q = `
        SELECT signature FROM signatures
        WHERE id = '${id}'
    `;
    const params = id;
    return db.query(q, params);
};

module.exports.addSign = (userId, signature) => {
    const q = `
        INSERT INTO signatures (userid, signature)
        VALUES ($1, $2)
        RETURNING id;
    `;
    const params = [userId, signature];
    // console.log("q: ", q);
    return db.query(q, params);
};

/////////////PART-3/////////////////

module.exports.regInputs = (first, last, email, password) => {
    const q = `
        INSERT INTO users (first_name, last_name, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `;
    const params = [first, last, email, password];
    // console.log("q: ", q);
    return db.query(q, params);
};

module.exports.selectPasswordAndMail = (email) => {
    const q = `
        SELECT email, password_hash, id
        FROM users  
        WHERE email = '${email}'
    `;

    const params = email;
    return db.query(q, params);
};

/////////////PART-4/////////////////

//INSERTinto user_profiles

module.exports.reqUserInfo = (age, city, homepage, userId) => {
    const q = `
        INSERT INTO user_profiles (age, city, url, userid)
        VALUES ($1, $2, $3, $4)
        RETURNING userid
    `;
    const params = [age, city, homepage, userId];
    // console.log("q: ", q);
    return db.query(q, params);
};

//SELECT in /signers to get name, age, city, url of all who signed
//we have to JOIN 3 tables here!!!

//SELECT in signers by city is basically the same as above but with a conditional
