-- Create a new database called 'perntodo'
CREATE DATABASE perntodo;

CREATE TABLE todo(
    id SERIAL PRIMARY KEY,
    description VARCHAR(255),
);