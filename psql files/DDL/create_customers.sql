CREATE Table customer (
    customer_id SERIAL PRIMARY KEY,
    cname VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    email VARCHAR(255) UNIQUE
);