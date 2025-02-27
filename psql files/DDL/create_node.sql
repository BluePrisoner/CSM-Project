CREATE TABLE node_point(
    node_id INT,
    station_id INT,
    node_type VARCHAR(20) NOT NULL,
    latitude DECIMAL(9,6) DEFAULT 0.000000,
    longitude DECIMAL(9,6) DEFAULT 0.000000,
    capacity VARCHAR(10),
    node_status VARCHAR(10) CHECK (node_status IN ('active', 'inactive')),
    PRIMARY KEY (node_id),
    FOREIGN KEY (station_id) REFERENCES control_station(station_id) 
);