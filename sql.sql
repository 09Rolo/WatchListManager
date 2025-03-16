-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS watchlistmanager;

-- Use the database
USE watchlistmanager;

-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Movies table
CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    api_id VARCHAR(50) UNIQUE,
    release_year INT,
    poster_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Series table
CREATE TABLE series (
    series_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    api_id VARCHAR(50) UNIQUE,
    total_seasons INT,
    total_episodes INT,
    poster_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Episodes table
CREATE TABLE episodes (
    episode_id SERIAL PRIMARY KEY,
    series_id INT REFERENCES series(series_id) ON DELETE CASCADE,
    season_number INT NOT NULL,
    episode_number INT NOT NULL,
    title VARCHAR(255),
    air_date DATE,
    UNIQUE (series_id, season_number, episode_number)
);

-- User Wishlist table
CREATE TABLE user_wishlist (
    wishlist_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    series_id INT REFERENCES series(series_id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, movie_id, series_id)
);

-- User Watched Movies table
CREATE TABLE user_watched_movies (
    watched_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, movie_id)
);

-- User Watched Episodes table
CREATE TABLE user_watched_episodes (
    watched_episode_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    episode_id INT REFERENCES episodes(episode_id) ON DELETE CASCADE,
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, episode_id)
);

-- User Notes table
CREATE TABLE user_notes (
    note_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    series_id INT REFERENCES series(series_id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (user_id, series_id)
);

-- User Links table
CREATE TABLE user_links (
    link_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    series_id INT REFERENCES series(series_id) ON DELETE CASCADE,
    link_url TEXT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, movie_id, series_id)
);
