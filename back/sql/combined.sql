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
-- Clear and add users
DELETE FROM users;
ALTER SEQUENCE users_id_seq RESTART WITH 1;

INSERT INTO users (username, pwd)
VALUES ('mikko', 'cleartext_salasana_:D'),
		 ('veeti', 'jonneweb'),
		 ('maija', 'salasana123'),
		 ('irmeli ', 'jonneweb2');
		 
-- Clear and add cars
DELETE FROM cars;
ALTER SEQUENCE cars_id_seq RESTART WITH 1;

INSERT INTO cars (userid, carsize)
VALUES (1, 5),
		 (2, 5),
		 (3, 5),
		 (4, 5);

-- Clear and add pools
DELETE FROM pools;
ALTER SEQUENCE pools_id_seq RESTART WITH 1;

INSERT INTO pools (poolname, car)
VALUES ('Huvitie-Keilaranta', 1);

-- Clear and add points
DELETE FROM POINTS;
ALTER SEQUENCE points_id_seq RESTART WITH 1;

INSERT INTO points (lat, lon, ptime)
VALUES (60.634473, 25.317657, '2020-10-11 07:00:00'), -- Huvitie, Mäntsälä
		 (60.176932, 24.832692, '2020-10-11 12:00:00'); -- Keilaranta, Espoo

-- Clear and add routes
DELETE FROM pool_route;
ALTER SEQUENCE pool_route_id_seq RESTART WITH 1;

INSERT INTO pool_route (poolid, startpoint, endpoint, userid)
VALUES (1, 1, 2, 1);
