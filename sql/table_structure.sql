--DROP TABLE users CASCADE;
--DROP TABLE points CASCADE;
--DROP TABLE cars CASCADE;
--DROP TABLE pools CASCADE;
--DROP TABLE pool_route CASCADE;

CREATE TABLE users (
    username TEXT,
    pwd TEXT,
    id SERIAL PRIMARY KEY
);

CREATE TABLE points (
	lat FLOAT,
	lon FLOAT,
	ptime TIMESTAMP,
	id SERIAL PRIMARY KEY
);

CREATE TABLE cars (
	userid INTEGER,
	id SERIAL PRIMARY KEY,
	lat FLOAT,
	lon FLOAT,
	carsize INTEGER,
	FOREIGN KEY (userid) REFERENCES users(id)
);

CREATE TABLE pools (
	id SERIAL PRIMARY KEY,
	poolname TEXT,
	car INTEGER,
	FOREIGN KEY (car) REFERENCES cars(id)
);

CREATE TABLE pool_route (
	id SERIAL PRIMARY KEY,
	poolid INTEGER,
	startpoint INTEGER,
	endpoint INTEGER,
	userid INTEGER,
	FOREIGN KEY (poolid) REFERENCES pools(id),
	FOREIGN KEY (startpoint) REFERENCES points(id),
	FOREIGN KEY (endpoint) REFERENCES points(id),
	FOREIGN KEY (userid) REFERENCES users(id)
);
