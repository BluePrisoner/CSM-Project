CREATE TABLE customer_connections (
    connection_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    node_id INT NULL,
    amplifier_id INT NULL,
    connection_type VARCHAR(20) CHECK (connection_type IN ('Direct', 'Amplified')) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (node_id) REFERENCES node_point(node_id) ON DELETE SET NULL,
    FOREIGN KEY (amplifier_id) REFERENCES amplifier(amplifier_id) ON DELETE SET NULL
);
