const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/petition"
);

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
        SELECT signature, id FROM signatures
        WHERE userid = ${id}
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

//SELECT in signers by city is basically the same as above but with a conditional
module.exports.signersByCity = (city) => {
    const q = `
        SELECT users.first_name, users.last_name, 
            user_profiles.age, user_profiles.city, 
            user_profiles.url
        FROM signatures 
        LEFT JOIN users ON (signatures.userid = users.id)
        LEFT JOIN user_profiles ON (signatures.userid = user_profiles.userid)
        WHERE LOWER(city) = LOWER('${city}')
    `;
    const params = city;
    return db.query(q, params);
};

/////////////PART-5/////////////////

module.exports.getInfoEdit = (userId) => {
    const q = `
        SELECT users.first_name, users.last_name,
            users.email, user_profiles.age, user_profiles.city,
            user_profiles.url
        FROM users
        LEFT JOIN user_profiles ON (user_profiles.userid = users.id)
        WHERE users.id = '${userId}'

    `;
    const params = userId;
    return db.query(q, params);
};

module.exports.updateUserWithoutPassword = (first, last, userId, email) => {
    const q = `
        UPDATE users
        SET first_name = $1, last_name = $2, 
        email = $4
        WHERE id = $3;
    `;
    const params = [first, last, userId, email];
    return db.query(q, params);
};

module.exports.updateProfileWithoutPassword = (age, city, url, userId) => {
    const q = `
        INSERT INTO user_profiles (age, city, url, userid)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (userId)
        DO UPDATE SET age = $1, city = $2, url = $3;
    `;
    const params = [age, city, url, userId];
    return db.query(q, params);
};

module.exports.updatePassword = (userId, password) => {
    const q = `
        UPDATE users
        SET password_hash = $2
        WHERE id = $1;
    `;
    const params = [userId, password];
    return db.query(q, params);
};

module.exports.getPasswordwithId = (userId) => {
    const q = `
        SELECT password_hash
        FROM users  
        WHERE id = ${userId}
    `;
    const params = userId;
    return db.query(q, params);
};

///delete signature////

module.exports.deleteSign = (userId) => {
    const q = `
    DELETE 
    FROM signatures 
    WHERE userid = ${userId};
    `;
    const params = userId;
    return db.query(q, params);
};

///forget user//////////
module.exports.forgetUserId = (userId) => {
    const q = `
        DELETE
        FROM users
        WHERE id = ${userId};
    `;
    const params = userId;
    return db.query(q, params);
};

module.exports.forgetUserSignature = (userId) => {
    const q = `
        DELETE
        FROM signatures
        WHERE userid = ${userId};
    `;
    const params = userId;
    return db.query(q, params);
};

module.exports.forgetUserProfile = (userId) => {
    const q = `
        DELETE
        FROM user_profiles
        WHERE userid = ${userId};
    `;
    const params = userId;
    return db.query(q, params);
};
