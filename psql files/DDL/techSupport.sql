CREATE TABLE technical_support (
    ticket_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    issue_description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Open',
    resolution_date DATE DEFAULT NULL CHECK (resolution_date >= created_at),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);
