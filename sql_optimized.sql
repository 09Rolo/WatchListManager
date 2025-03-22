-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS watchlistmanager;

-- Use the database
USE watchlistmanager;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Movies table
CREATE TABLE IF NOT EXISTS movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    api_id VARCHAR(50) UNIQUE,
    release_year YEAR,
    poster_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Series table
CREATE TABLE IF NOT EXISTS series (
    series_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    api_id VARCHAR(50) UNIQUE,
    total_seasons INT DEFAULT 0,
    total_episodes INT DEFAULT 0,
    poster_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Episodes table
CREATE TABLE IF NOT EXISTS episodes (
    episode_id INT AUTO_INCREMENT PRIMARY KEY,
    series_id INT NOT NULL,
    season_number INT NOT NULL,
    episode_number INT NOT NULL,
    title VARCHAR(255),
    air_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (series_id) REFERENCES series(series_id) ON DELETE CASCADE,
    UNIQUE (series_id, season_number, episode_number)
);

-- User Wishlist table
CREATE TABLE IF NOT EXISTS user_wishlist (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT DEFAULT NULL,
    series_id INT DEFAULT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (series_id) REFERENCES series(series_id) ON DELETE CASCADE,
    UNIQUE (user_id, movie_id, series_id)
);

-- User Watched Movies table
CREATE TABLE IF NOT EXISTS user_watched_movies (
    watched_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    UNIQUE (user_id, movie_id)
);

-- User Watched Episodes table
CREATE TABLE IF NOT EXISTS user_watched_episodes (
    watched_episode_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    episode_id INT NOT NULL,
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (episode_id) REFERENCES episodes(episode_id) ON DELETE CASCADE,
    UNIQUE (user_id, episode_id)
);

-- User Notes table
CREATE TABLE IF NOT EXISTS user_notes (
    note_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT DEFAULT NULL,
    series_id INT DEFAULT NULL,
    note TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (series_id) REFERENCES series(series_id) ON DELETE CASCADE,
    UNIQUE (user_id, movie_id, series_id)
);

-- User Links table
CREATE TABLE IF NOT EXISTS user_links (
    link_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT DEFAULT NULL,
    series_id INT DEFAULT NULL,
    link_url TEXT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (series_id) REFERENCES series(series_id) ON DELETE CASCADE,
    UNIQUE (user_id, movie_id, series_id)
);
