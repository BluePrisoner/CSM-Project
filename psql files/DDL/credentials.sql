CREATE TABLE credentials (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE not NULL,
    password text not NULL,
    role varchar(20) DEFAULT 'user' check (role in('user', 'admin')) 
);