CREATE TABLE subscription (
    subscription_id SERIAL,
    customer_id INT NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL CHECK (end_date >= start_date),
    status VARCHAR(20) DEFAULT 'Active',
    PRIMARY KEY (subscription_id, customer_id),  
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);
