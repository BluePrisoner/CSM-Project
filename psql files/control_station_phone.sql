CREATE TABLE phone_no(
    station_id INT,
    phone_no CHAR(10),
    PRIMARY KEY (station_id,phone_no),
    FOREIGN KEY (station_id) REFERENCES control_station(station_id) ON DELETE CASCADE
);