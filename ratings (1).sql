-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 12. 21:51
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `webshoppp`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ratings`
--

CREATE TABLE `ratings` (
  `rating_id` int(11) NOT NULL,
  `f_azonosito` int(11) NOT NULL,
  `rating` int(1) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `velemeny` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `ratings`
--

INSERT INTO `ratings` (`rating_id`, `f_azonosito`, `rating`, `date`, `velemeny`) VALUES
(1, 24, 4, '2025-03-12 13:09:43', NULL),
(2, 2, 5, '2025-03-12 13:15:10', NULL),
(3, 2, 5, '2025-03-12 14:08:06', 'naon jo'),
(4, 2, 5, '2025-03-12 14:14:13', 'nagyon tetszik ez az oldal nekem, mert nagyon modern a felulet es gyors felhasznaloi elmenyt adott'),
(5, 2, 4, '2025-03-12 14:18:28', 'nagyon jo'),
(6, 2, 5, '2025-03-12 15:24:11', 'aaaa'),
(7, 2, 5, '2025-03-12 15:24:54', 'adadad'),
(8, 2, 5, '2025-03-12 16:04:42', 'fdahfiusdhgfsfsdbfuisodfbsuiydfgosuydgfsh'),
(9, 2, 5, '2025-03-12 18:45:34', NULL),
(10, 2, 5, '2025-03-12 18:46:14', NULL),
(11, 2, 5, '2025-03-12 19:01:10', 'dasds'),
(15, 2, 1, '2025-03-12 19:39:08', 'dasds');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`rating_id`),
  ADD KEY `f_azonosito` (`f_azonosito`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `ratings`
--
ALTER TABLE `ratings`
  MODIFY `rating_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`f_azonosito`) REFERENCES `user` (`f_azonosito`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
