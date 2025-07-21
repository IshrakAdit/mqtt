-- Create Enum type for ALERT_TYPE (PostgreSQL syntax)
CREATE TYPE alert_type_enum AS ENUM ('CROP', 'TASK', 'WEATHER');

-- Create users table
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL UNIQUE
);

-- Create alerts table
CREATE TABLE alerts (
                        id BIGSERIAL PRIMARY KEY,
                        type alert_type_enum NOT NULL,
                        description TEXT,
                        user_id BIGINT NOT NULL,
                        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name) VALUES
                             ('Alice'),
                             ('Bob'),
                             ('Charlie'),
                             ('Diana'),
                             ('Eve');

-- User 1: Alice (id=1)
INSERT INTO alerts (type, description, user_id) VALUES
                                                    ('CROP', 'Alice crop alert 1', 1),
                                                    ('TASK', 'Alice task alert 2', 1),
                                                    ('WEATHER', 'Alice weather alert 3', 1);

-- User 2: Bob (id=2)
INSERT INTO alerts (type, description, user_id) VALUES
                                                    ('TASK', 'Bob task alert 1', 2),
                                                    ('CROP', 'Bob crop alert 2', 2),
                                                    ('WEATHER', 'Bob weather alert 3', 2);

-- User 3: Charlie (id=3)
INSERT INTO alerts (type, description, user_id) VALUES
                                                    ('WEATHER', 'Charlie weather alert 1', 3),
                                                    ('TASK', 'Charlie task alert 2', 3),
                                                    ('CROP', 'Charlie crop alert 3', 3);

-- User 4: Diana (id=4)
INSERT INTO alerts (type, description, user_id) VALUES
                                                    ('CROP', 'Diana crop alert 1', 4),
                                                    ('WEATHER', 'Diana weather alert 2', 4),
                                                    ('TASK', 'Diana task alert 3', 4);

-- User 5: Eve (id=5)
INSERT INTO alerts (type, description, user_id) VALUES
                                                    ('TASK', 'Eve task alert 1', 5),
                                                    ('CROP', 'Eve crop alert 2', 5),
                                                    ('WEATHER', 'Eve weather alert 3', 5);


-- Set proper id sequence
SELECT setval('users_id_seq', 5, true);
SELECT setval('alerts_id_seq', 15, true);