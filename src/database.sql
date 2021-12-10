CREATE TABLE auto (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(255),
    model VARCHAR(255),
    state_number VARCHAR(100),
    vin VARCHAR(100)
);

CREATE TABLE rent (
    id SERIAL PRIMARY KEY,
    created_date TIMESTAMP DEFAULT now(),
    auto_id INTEGER,
    day INTEGER,
    price INTEGER,
    FOREIGN KEY (auto_id) REFERENCES auto (id)
);


