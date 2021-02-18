--petes lesson

-- comments look like this in sql

-- this file will create a table for us.

-- first we need to delete the old table (if it exists)
DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY NOT NULL,
    first VARCHAR(255) NOT NULL CHECK (first != ''),
    last VARCHAR(255) NOT NULL CHECK (last != ''),
    signature TEXT NOT NULL CHECK (signature != '')
);



--  CHECK (signature != '')