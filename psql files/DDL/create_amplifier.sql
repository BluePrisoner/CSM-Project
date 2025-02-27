create TABLE amplifier(
    amplifier_id INT,
    node_id INT,
    amplifier_type VARCHAR(20) NOT NULL,
    latitude DECIMAL(9,6) DEFAULT 0.000000,
    longitude DECIMAL(9,6) DEFAULT 0.000000,
    capacity VARCHAR(10),
    amp_status VARCHAR(10) CHECK (amp_status IN ('active', 'inactive')),
    PRIMARY KEY (amplifier_id),
    FOREIGN KEY (node_id) REFERENCES node_point(node_id)
);