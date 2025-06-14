-- --------------------------------------------------------
-- Gazdagép:                     127.0.0.1
-- Szerver verzió:               10.4.32-MariaDB - mariadb.org binary distribution
-- Szerver OS:                   Win64
-- HeidiSQL Verzió:              12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;



CREATE DATABASE IF NOT EXISTS `watchlistmanager` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `watchlistmanager`;

-- Struktúra mentése tábla watchlistmanager. users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tábla adatainak mentése watchlistmanager.users: ~5 rows (hozzávetőleg)
INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `created_at`) VALUES
	(1, 'Rolo', 'rolo.kiss.09@gmail.com', '$2b$10$LLpZmIayVOXi9PIP1DkY7.12g0I7MRmOnZuqKjgBM8PEj0z0IqsXS', '2025-03-29 14:01:51'),
	(2, 'Tünde', 'kbtunde1@freemail.hu', '$2b$10$c1FsGb8x5qIbXgixpAx1mO0hMbJ21x9xbysaT5im4solvjnaVI72S', '2025-03-30 12:22:33'),
	(4, 'Róland', 'kissbar3100@gmail.com', '$2b$10$bR92.U13vfOiq2LYnHvzKeoq6DtDobBmDZqEtkApRJeenExgiU7ge', '2025-03-30 15:37:40'),
	(5, 'Karisz', 'ifjulukacs@gmail.com', '$2b$10$7Ibrz5GIVfzKe9zzO03jgOK.KWo3WtTJmppWBXaPt03YqSXgrCE6G', '2025-04-01 07:42:08'),
	(6, 'Levi', 'nagylevi20080115@gmail.com', '$2b$10$41q2H1chec2VuxUKGtxdHudooP6IwIIeWb5OJE4aLRbHHb8apTfxq', '2025-04-01 19:25:39');


-- Struktúra mentése tábla watchlistmanager. user_links
CREATE TABLE IF NOT EXISTS `user_links` (
  `link_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `series_id` int(11) DEFAULT NULL,
  `link_url` text NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`link_id`),
  UNIQUE KEY `user_id` (`user_id`,`movie_id`,`series_id`),
  CONSTRAINT `user_links_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tábla adatainak mentése watchlistmanager.user_links: ~3 rows (hozzávetőleg)
INSERT INTO `user_links` (`link_id`, `user_id`, `movie_id`, `series_id`, `link_url`, `added_at`) VALUES
	(1, 1, 183392, NULL, 'https://www.youtube.com/watch?v=ID98j7z_BBs&ab_channel=HABALA', '2025-03-29 20:50:46'),
	(2, 1, 110415, NULL, 'https://videa.hu/videok/film-animacio/snowpiercer-tulelok-viadala-2013-film-animacio-FSUdTaWVtar1MTml', '2025-03-29 21:38:22'),
	(3, 1, NULL, 1396, 'https://moviedrive.hu/sorozat/?id=806', '2025-06-13 18:58:53');



-- Struktúra mentése tábla watchlistmanager. user_notes
CREATE TABLE IF NOT EXISTS `user_notes` (
  `note_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `series_id` int(11) DEFAULT NULL,
  `note` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`note_id`),
  UNIQUE KEY `user_id` (`user_id`,`movie_id`,`series_id`),
  CONSTRAINT `user_notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tábla adatainak mentése watchlistmanager.user_notes: ~10 rows (hozzávetőleg)
INSERT INTO `user_notes` (`note_id`, `user_id`, `movie_id`, `series_id`, `note`, `updated_at`) VALUES
	(3, 1, 110415, NULL, 'Megnézni közösen, én abbahagytam a leges legvégén, és nem tudom mennyire sok szöveget lehet ide írni, de ha már van akkor kifullozzuk mert miért ne. Legalább gyakorlom a gépelést is, és akkor meglátjuk, hogy lehet lentebb kellene vennem a karakter sz', '2025-03-29 21:43:08'),
	(4, 1, 183392, NULL, 'Érdekes lehet, kíváncsi vagyok milyen', '2025-03-29 22:59:45'),
	(5, 1, 83533, NULL, 'Majd moziba jó lenne a családdal közösen, ha kijön év végére', '2025-03-29 23:01:02'),
	(6, 1, 1072876, NULL, 'Érdekes volt a vége, de nagyon fasza koncepció', '2025-03-29 23:03:05'),
	(7, 1, 19995, NULL, 'ydfdghf,d,kkgh', '2025-03-30 12:18:57'),
	(8, 1, 950387, NULL, 'Április 3, csüt. Mozi\n4dx 3dben mennyire fasza lehetne már Leviékkel XD', '2025-04-01 04:31:06'),
	(9, 5, 912649, NULL, 'Jó vólt', '2025-04-01 07:43:40'),
	(10, 6, 696506, NULL, 'Közösen láttuk a dagadttal és Kendével', '2025-04-01 19:27:49'),
	(11, 1, 1273059, NULL, 'Debreceni forgatás!!!!', '2025-04-14 19:45:23'),
	(12, 1, 559969, NULL, 'Breaking bad 5. Évada után megnézni', '2025-05-04 15:49:13'),
	(13, 1, NULL, 1396, 'TOP 1. Kva jó.\nMilán ajánlotta :D\nExtrákat meg kell még nézni azért', '2025-06-13 19:11:24');




-- Struktúra mentése tábla watchlistmanager. user_watched_episodes
CREATE TABLE IF NOT EXISTS `user_watched_episodes` (
  `watched_episode_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `series_id` int(11) DEFAULT NULL,
  `episode_id` int(11) NOT NULL,
  `watched_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`watched_episode_id`),
  UNIQUE KEY `user_id` (`user_id`,`series_id`,`episode_id`),
  CONSTRAINT `user_watched_episodes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tábla adatainak mentése watchlistmanager.user_watched_episodes: ~109 rows (hozzávetőleg)
INSERT INTO `user_watched_episodes` (`watched_episode_id`, `user_id`, `series_id`, `episode_id`, `watched_at`) VALUES
	(86, 1, 1396, 62085, '2025-06-13 23:29:40'),
	(87, 1, 1396, 62086, '2025-06-13 23:29:40'),
	(88, 1, 1396, 62087, '2025-06-13 23:29:40'),
	(89, 1, 1396, 62088, '2025-06-13 23:29:40'),
	(90, 1, 1396, 62089, '2025-06-13 23:29:40'),
	(91, 1, 1396, 62090, '2025-06-13 23:29:40'),
	(92, 1, 1396, 62091, '2025-06-13 23:29:40'),
	(93, 1, 1396, 972873, '2025-06-13 23:29:40'),
	(94, 1, 1396, 972874, '2025-06-13 23:29:40'),
	(95, 1, 1396, 62094, '2025-06-13 23:29:40'),
	(96, 1, 1396, 62095, '2025-06-13 23:29:40'),
	(97, 1, 1396, 62096, '2025-06-13 23:29:40'),
	(98, 1, 1396, 62097, '2025-06-13 23:29:40'),
	(99, 1, 1396, 62098, '2025-06-13 23:29:40'),
	(100, 1, 1396, 62099, '2025-06-13 23:29:40'),
	(101, 1, 1396, 62100, '2025-06-13 23:29:40'),
	(102, 1, 1396, 62101, '2025-06-13 23:29:40'),
	(103, 1, 1396, 62102, '2025-06-13 23:29:40'),
	(104, 1, 1396, 62103, '2025-06-13 23:29:40'),
	(105, 1, 1396, 62104, '2025-06-13 23:29:40'),
	(106, 1, 1396, 62105, '2025-06-13 23:29:40'),
	(107, 1, 1396, 62106, '2025-06-13 23:29:40'),
	(108, 1, 1396, 62107, '2025-06-13 23:29:40'),
	(109, 1, 1396, 62108, '2025-06-13 23:29:40'),
	(110, 1, 1396, 62109, '2025-06-13 23:29:40'),
	(111, 1, 1396, 62110, '2025-06-13 23:29:40'),
	(112, 1, 1396, 62111, '2025-06-13 23:29:40'),
	(113, 1, 1396, 62112, '2025-06-13 23:29:40'),
	(114, 1, 1396, 62113, '2025-06-13 23:29:40'),
	(115, 1, 1396, 62114, '2025-06-13 23:29:40'),
	(116, 1, 1396, 62115, '2025-06-13 23:29:40'),
	(117, 1, 1396, 62116, '2025-06-13 23:29:40'),
	(118, 1, 1396, 62117, '2025-06-13 23:29:40'),
	(119, 1, 1396, 62118, '2025-06-13 23:29:40'),
	(120, 1, 1396, 62119, '2025-06-13 23:29:40'),
	(121, 1, 1396, 62120, '2025-06-13 23:29:40'),
	(122, 1, 1396, 62122, '2025-06-13 23:29:40'),
	(123, 1, 1396, 62123, '2025-06-13 23:29:40'),
	(124, 1, 1396, 62124, '2025-06-13 23:29:40'),
	(125, 1, 1396, 62121, '2025-06-13 23:29:40'),
	(126, 1, 1396, 62127, '2025-06-13 23:29:40'),
	(127, 1, 1396, 62125, '2025-06-13 23:29:40'),
	(128, 1, 1396, 62126, '2025-06-13 23:29:40'),
	(129, 1, 1396, 62129, '2025-06-13 23:29:40'),
	(130, 1, 1396, 62128, '2025-06-13 23:29:40'),
	(131, 1, 1396, 62130, '2025-06-13 23:29:40'),
	(132, 1, 1396, 62147, '2025-06-13 23:29:40'),
	(133, 1, 1396, 62148, '2025-06-13 23:29:40'),
	(134, 1, 1396, 62149, '2025-06-13 23:29:40'),
	(135, 1, 1396, 62150, '2025-06-13 23:29:40'),
	(136, 1, 1396, 62151, '2025-06-13 23:29:40'),
	(137, 1, 1396, 62152, '2025-06-13 23:29:40'),
	(138, 1, 1396, 62153, '2025-06-13 23:29:40'),
	(139, 1, 1396, 62154, '2025-06-13 23:29:40'),
	(140, 1, 1396, 62155, '2025-06-13 23:29:40'),
	(141, 1, 1396, 62156, '2025-06-13 23:29:40'),
	(142, 1, 1396, 62159, '2025-06-13 23:29:40'),
	(143, 1, 1396, 62158, '2025-06-13 23:29:40'),
	(144, 1, 1396, 62157, '2025-06-13 23:29:40'),
	(145, 1, 1396, 62162, '2025-06-13 23:29:40'),
	(146, 1, 1396, 62160, '2025-06-13 23:29:40'),
	(147, 1, 1396, 62161, '2025-06-13 23:29:40'),
	(148, 1, 1429, 65480, '2025-06-14 00:01:11'),
	(149, 1, 1429, 65490, '2025-06-14 00:01:11'),
	(150, 1, 1429, 65473, '2025-06-14 00:01:11'),
	(151, 1, 1429, 65474, '2025-06-14 00:01:11'),
	(152, 1, 1429, 65491, '2025-06-14 00:01:11'),
	(153, 1, 1429, 65475, '2025-06-14 00:01:11'),
	(154, 1, 1429, 65476, '2025-06-14 00:01:11'),
	(155, 1, 1429, 65477, '2025-06-14 00:01:11'),
	(156, 1, 1429, 65479, '2025-06-14 00:01:11'),
	(157, 1, 1429, 65496, '2025-06-14 00:01:11'),
	(158, 1, 1429, 65495, '2025-06-14 00:01:11'),
	(159, 1, 1429, 65494, '2025-06-14 00:01:11'),
	(160, 1, 1429, 65492, '2025-06-14 00:01:11'),
	(161, 1, 1429, 65478, '2025-06-14 00:01:11'),
	(162, 1, 1429, 65481, '2025-06-14 00:01:11'),
	(163, 1, 1429, 65493, '2025-06-14 00:01:11'),
	(164, 1, 1429, 65487, '2025-06-14 00:01:11'),
	(165, 1, 1429, 65486, '2025-06-14 00:01:11'),
	(166, 1, 1429, 65482, '2025-06-14 00:01:11'),
	(167, 1, 1429, 65483, '2025-06-14 00:01:11'),
	(168, 1, 1429, 65489, '2025-06-14 00:01:11'),
	(169, 1, 1429, 65485, '2025-06-14 00:01:11'),
	(170, 1, 1429, 65484, '2025-06-14 00:01:11'),
	(171, 1, 1429, 65488, '2025-06-14 00:01:11'),
	(172, 1, 1429, 65497, '2025-06-14 00:01:11'),
	(173, 1, 1429, 1265623, '2025-06-14 00:01:22'),
	(174, 1, 1429, 1299003, '2025-06-14 00:01:22'),
	(175, 1, 1429, 1299005, '2025-06-14 00:01:22'),
	(176, 1, 60059, 1019693, '2025-06-14 00:04:50'),
	(177, 1, 60059, 1019694, '2025-06-14 00:04:50'),
	(178, 1, 60059, 1019695, '2025-06-14 00:04:50'),
	(179, 1, 60059, 1040243, '2025-06-14 00:04:50'),
	(180, 1, 60059, 1040244, '2025-06-14 00:04:50'),
	(181, 1, 270487, 5577890, '2025-06-14 00:14:08'),
	(182, 1, 270487, 5893725, '2025-06-14 00:14:08'),
	(183, 1, 270487, 5893726, '2025-06-14 00:14:08'),
	(184, 1, 270487, 5893727, '2025-06-14 00:14:08'),
	(185, 1, 270487, 5893728, '2025-06-14 00:14:08'),
	(186, 1, 270487, 5893729, '2025-06-14 00:14:08'),
	(187, 1, 270487, 5893731, '2025-06-14 00:14:08'),
	(188, 1, 270487, 5893732, '2025-06-14 00:14:08'),
	(189, 1, 270487, 5893733, '2025-06-14 00:14:08'),
	(190, 1, 270487, 5893734, '2025-06-14 00:14:08'),
	(191, 1, 270487, 5893735, '2025-06-14 00:14:08'),
	(192, 1, 270487, 5893736, '2025-06-14 00:14:08'),
	(193, 1, 270487, 5893741, '2025-06-14 00:14:08'),
	(194, 1, 270487, 5893742, '2025-06-14 00:14:08');




-- Struktúra mentése tábla watchlistmanager. user_watched_movies
CREATE TABLE IF NOT EXISTS `user_watched_movies` (
  `watched_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `watched_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`watched_id`),
  UNIQUE KEY `user_id` (`user_id`,`movie_id`),
  CONSTRAINT `user_watched_movies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tábla adatainak mentése watchlistmanager.user_watched_movies: ~21 rows (hozzávetőleg)
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
	(15, 1, 4258, '2025-03-31 11:42:36'),
	(16, 1, 601, '2025-03-31 14:28:51'),
	(17, 1, 353486, '2025-04-01 03:01:26'),
	(18, 1, 512200, '2025-04-01 03:01:36'),
	(19, 1, 8844, '2025-04-01 03:01:56'),
	(20, 5, 912649, '2025-04-01 07:42:55'),
	(21, 6, 696506, '2025-04-01 19:27:15'),
	(23, 1, 1412113, '2025-04-02 10:11:14'),
	(24, 1, 950387, '2025-04-14 19:41:55'),
	(25, 1, 760747, '2025-04-14 21:55:13'),
	(27, 1, 559969, '2025-06-14 00:09:44');



-- Struktúra mentése tábla watchlistmanager. user_wishlist
CREATE TABLE IF NOT EXISTS `user_wishlist` (
  `wishlist_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `series_id` int(11) DEFAULT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`wishlist_id`),
  UNIQUE KEY `user_id` (`user_id`,`movie_id`,`series_id`),
  CONSTRAINT `user_wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tábla adatainak mentése watchlistmanager.user_wishlist: ~19 rows (hozzávetőleg)
INSERT INTO `user_wishlist` (`wishlist_id`, `user_id`, `movie_id`, `series_id`, `added_at`) VALUES
	(15, 1, 1059673, NULL, '2025-03-29 21:02:12'),
	(16, 1, 111332, NULL, '2025-03-29 21:02:35'),
	(17, 1, 83533, NULL, '2025-03-29 21:02:53'),
	(18, 1, 183392, NULL, '2025-03-29 21:19:59'),
	(20, 1, 978592, NULL, '2025-03-29 22:39:20'),
	(22, 2, 76600, NULL, '2025-03-30 12:23:27'),
	(23, 4, 6479, NULL, '2025-03-30 22:06:21'),
	(24, 4, 83533, NULL, '2025-03-30 22:07:10'),
	(25, 1, 4247, NULL, '2025-03-31 11:42:03'),
	(27, 1, 1197306, NULL, '2025-04-01 04:28:07'),
	(28, 5, 1197306, NULL, '2025-04-01 07:44:17'),
	(29, 6, 950387, NULL, '2025-04-01 19:26:17'),
	(30, 6, 615, NULL, '2025-04-01 19:32:08'),
	(31, 1, 631842, NULL, '2025-04-03 14:27:46'),
	(32, 1, 263472, NULL, '2025-04-03 14:28:12'),
	(33, 1, 397243, NULL, '2025-04-14 19:44:41'),
	(34, 1, 1273059, NULL, '2025-04-14 19:45:09'),
	(35, 1, 88751, NULL, '2025-04-14 19:50:28'),
	(38, 1, 934809, NULL, '2025-06-13 17:21:13'),
	(42, 1, NULL, 13916, '2025-06-14 00:02:21'),
	(43, 1, NULL, 90746, '2025-06-14 00:04:33');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
