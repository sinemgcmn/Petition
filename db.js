const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

////////PART 1/////////////////

module.exports.getAllSign = () => {
    const q = `
        SELECT first_name, last_name
        FROM users
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
        WHERE id = $1
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.addSign = (userId, signature) => {
    const q = `
        INSERT INTO signatures (userid, signature)
        VALUES ($1, $2)
        RETURNING id
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

module.exports.selectMail = (input_email) => {
    const q = `
        SELECT email
        FROM users  
        WHERE email = '${input_email}'
    `;

    const params = input_email;
    return db.query(q, params);
};

module.exports.selectPassword = (email) => {
    const q = `
        SELECT password_hash
        FROM users
        WHERE email = '${email}'
    `;

    const params = email;
    return db.query(q, params);
};
