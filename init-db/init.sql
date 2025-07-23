CREATE USER mqtt_user WITH PASSWORD 'mqtt_password';
CREATE DATABASE mqtt_db;

GRANT ALL PRIVILEGES ON DATABASE mqtt_db TO mqtt_user;

\connect mqtt_db
GRANT ALL ON SCHEMA public TO mqtt_user;
ALTER SCHEMA public OWNER TO mqtt_user;
