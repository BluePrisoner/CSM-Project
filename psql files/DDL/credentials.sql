CREATE TABLE credentials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) not NULL,
    email VARCHAR(255) UNIQUE not NULL,
    password text not NULL,
    role varchar(20) DEFAULT 'user' check (role in('user', 'admin')) 
);

