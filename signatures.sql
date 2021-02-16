--petes lesson

-- comments look like this in sql

-- this file will create a table for us.

-- first we need to delete the old table (if it exists)
DROP TABLE IF EXISTS signatures;



CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    signature TEXT NOT NULL CHECK (signature != '')
);