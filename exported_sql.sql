-- --------------------------------------------------------
-- Hoszt:                        127.0.0.1
-- Szerver verzió:               10.4.28-MariaDB - mariadb.org binary distribution
-- Szerver OS:                   Win64
-- HeidiSQL Verzió:              12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Tábla adatainak mentése watchlistmanager.users: ~2 rows (hozzávetőleg)
INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `created_at`) VALUES
	(1, 'Rolo', 'rolo.kiss.09@gmail.com', '$2b$10$LLpZmIayVOXi9PIP1DkY7.12g0I7MRmOnZuqKjgBM8PEj0z0IqsXS', '2025-03-29 14:01:51'),
	(2, 'Tünde', 'kbtunde1@freemail.hu', '$2b$10$c1FsGb8x5qIbXgixpAx1mO0hMbJ21x9xbysaT5im4solvjnaVI72S', '2025-03-30 12:22:33'),
	(4, 'Róland', 'kissbar3100@gmail.com', '$2b$10$bR92.U13vfOiq2LYnHvzKeoq6DtDobBmDZqEtkApRJeenExgiU7ge', '2025-03-30 15:37:40');

-- Tábla adatainak mentése watchlistmanager.user_links: ~2 rows (hozzávetőleg)
INSERT INTO `user_links` (`link_id`, `user_id`, `movie_id`, `series_id`, `link_url`, `added_at`) VALUES
	(1, 1, 183392, NULL, 'https://www.youtube.com/watch?v=ID98j7z_BBs&ab_channel=HABALA', '2025-03-29 20:50:46'),
	(2, 1, 110415, NULL, 'https://videa.hu/videok/film-animacio/snowpiercer-tulelok-viadala-2013-film-animacio-FSUdTaWVtar1MTml', '2025-03-29 21:38:22');

-- Tábla adatainak mentése watchlistmanager.user_notes: ~5 rows (hozzávetőleg)
INSERT INTO `user_notes` (`note_id`, `user_id`, `movie_id`, `series_id`, `note`, `updated_at`) VALUES
	(3, 1, 110415, NULL, 'Megnézni közösen, én abbahagytam a leges legvégén, és nem tudom mennyire sok szöveget lehet ide írni, de ha már van akkor kifullozzuk mert miért ne. Legalább gyakorlom a gépelést is, és akkor meglátjuk, hogy lehet lentebb kellene vennem a karakter sz', '2025-03-29 21:43:08'),
	(4, 1, 183392, NULL, 'Érdekes lehet, kíváncsi vagyok milyen', '2025-03-29 22:59:45'),
	(5, 1, 83533, NULL, 'Majd moziba jó lenne a családdal közösen, ha kijön év végére', '2025-03-29 23:01:02'),
	(6, 1, 1072876, NULL, 'Érdekes volt a vége, de nagyon fasza koncepció', '2025-03-29 23:03:05'),
	(7, 1, 19995, NULL, 'ydfdghf,d,kkgh', '2025-03-30 12:18:57');

-- Tábla adatainak mentése watchlistmanager.user_watched_episodes: ~0 rows (hozzávetőleg)

-- Tábla adatainak mentése watchlistmanager.user_watched_movies: ~11 rows (hozzávetőleg)
INSERT INTO `user_watched_movies` (`watched_id`, `user_id`, `movie_id`, `watched_at`) VALUES
	(4, 1, 76600, '2025-03-29 16:54:33'),
	(5, 1, 19995, '2025-03-29 17:11:13'),
	(6, 1, 533535, '2025-03-29 17:11:37'),
	(7, 1, 1072876, '2025-03-29 19:55:07'),
	(8, 1, 6479, '2025-03-29 21:14:42'),
	(10, 1, 110415, '2025-03-29 22:56:10'),
	(11, 1, 4256, '2025-03-30 12:17:58'),
	(12, 2, 19995, '2025-03-30 12:24:02'),
	(13, 1, 4248, '2025-03-31 11:42:09'),
	(14, 1, 4257, '2025-03-31 11:42:14'),
	(15, 1, 4258, '2025-03-31 11:42:36');

-- Tábla adatainak mentése watchlistmanager.user_wishlist: ~8 rows (hozzávetőleg)
INSERT INTO `user_wishlist` (`wishlist_id`, `user_id`, `movie_id`, `series_id`, `added_at`) VALUES
	(15, 1, 1059673, NULL, '2025-03-29 21:02:12'),
	(16, 1, 111332, NULL, '2025-03-29 21:02:35'),
	(17, 1, 83533, NULL, '2025-03-29 21:02:53'),
	(18, 1, 183392, NULL, '2025-03-29 21:19:59'),
	(20, 1, 978592, NULL, '2025-03-29 22:39:20'),
	(22, 2, 76600, NULL, '2025-03-30 12:23:27'),
	(23, 4, 6479, NULL, '2025-03-30 22:06:21'),
	(24, 4, 83533, NULL, '2025-03-30 22:07:10'),
	(25, 1, 4247, NULL, '2025-03-31 11:42:03');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
