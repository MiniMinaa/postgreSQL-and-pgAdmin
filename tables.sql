-- players table
CREATE TABLE players (
id SERIAL PRIMARY KEY,
name VARCHAR(50),
join_date DATE NOT NULL
);

-- games tables
CREATE TABLE games (
id SERIAL PRIMARY KEY,
title VARCHAR(50),
genre VARCHAR(50)
);

-- scores tables
CREATE TABLE scores (
id SERIAL PRIMARY KEY,
player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
score INTEGER,
date_played DATE
);

-- players table
INSERT INTO players (name, join_date) VALUES
('Alice', '2024-01-10'),
('Bob', '2024-02-15'),
('Charlie', '2024-03-20'),
('Diana', '2024-04-25'),
('Ethan', '2024-05-30');

-- games table
INSERT INTO games (title, genre) VALUES
('Space Invaders', 'Arcade'),
('Minecraft', 'Sandbox'),
('FIFA 24', 'Sports'),
('Call of Duty', 'Shooter'),
('The Witcher 3', 'RPG');

-- scores table
INSERT INTO scores (player_id, game_id, score, date_played) VALUES
(1, 1, 1500, '2024-06-01'),
(2, 2, 3000, '2024-06-02'),
(3, 3, 2, '2024-06-03'),
(4, 4, 1200, '2024-06-04'),
(5, 5, 2500, '2024-06-05');