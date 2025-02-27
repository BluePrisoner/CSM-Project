CREATE TABLE billing (
    bill_id SERIAL,
    customer_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    bill_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    PRIMARY KEY (bill_id, customer_id), 
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);
