--petes lesson

-- comments look like this in sql

-- this file will create a table for us.

-- first we need to delete the old table (if it exists)
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    first_name    VARCHAR NOT NULL CHECK (first_name <> ''),
    last_name     VARCHAR NOT NULL CHECK (last_name <> ''),
    email         VARCHAR NOT NULL UNIQUE CHECK (email <> ''),
    password_hash VARCHAR NOT NULL CHECK (password_hash <> ''),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY NOT NULL,
    userId INTEGER NOT NULL UNIQUE REFERENCES users (id),
    signature TEXT NOT NULL CHECK (signature != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



--  CHECK (signature != '')