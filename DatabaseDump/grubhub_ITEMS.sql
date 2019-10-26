CREATE DATABASE  IF NOT EXISTS `grubhub` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `grubhub`;
-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: grubhubdb.ciea7s8xmtar.us-west-1.rds.amazonaws.com    Database: grubhub
-- ------------------------------------------------------
-- Server version	8.0.15

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `ITEMS`
--

DROP TABLE IF EXISTS `ITEMS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ITEMS` (
  `ITEMID` int(11) NOT NULL AUTO_INCREMENT,
  `ITEMNAME` varchar(45) NOT NULL,
  `ITEMDESCRIPTION` varchar(45) DEFAULT NULL,
  `REST_NAME` varchar(45) DEFAULT NULL,
  `ITEMPRICE` double DEFAULT NULL,
  `SECTION` varchar(45) NOT NULL,
  PRIMARY KEY (`ITEMID`),
  UNIQUE KEY `itemid_UNIQUE` (`ITEMID`),
  KEY `rest_name_idx` (`REST_NAME`),
  CONSTRAINT `RESTNAME` FOREIGN KEY (`REST_NAME`) REFERENCES `OWNERS` (`REST_NAME`)
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ITEMS`
--

LOCK TABLES `ITEMS` WRITE;
/*!40000 ALTER TABLE `ITEMS` DISABLE KEYS */;
INSERT INTO `ITEMS` VALUES (16,'Chicken Makhani','','EatSmart',20,'Lunch and Dinner'),(19,'Chicken Tandoori','','EatSmart',20,'Appetizer'),(20,'Chicken Biryani','','EatSmart',20,'Lunch and Dinner'),(21,'Chicken Kebab','','EatSmart',10,'Appetizer'),(23,'Sweet Corn Soup','Corn in tangy water','Berco\'s',10,'Starters'),(25,'Hot and Sour Soup','Hot and sour soup is a variety of soups from ','Berco\'s',12,'Starters'),(44,'Manchow Soup','Manchow soup is a soup popular in Indian Chin','Berco\'s',8,'Starters'),(45,'Noodle Soup with Burnt Garlic','Noodle Soup with Burnt Garlic soup','Berco\'s',14,'Starters'),(46,'Veg Manchurian Bowl','Veg Manchurian Bowl','Berco\'s',18,'Meal Bowl'),(47,'Veg Szechuan Pan Fried Noodles Bowl','Veg Szechuan Pan Fried Noodles Bowl','Berco\'s',20,'Meal Bowl'),(48,'Three Pepper Bowl - Cottage Cheese','Three Pepper Bowl - Cottage Cheese','Berco\'s',18,'Meal Bowl'),(52,'Veg Soggy Basil Bowl - Thai Classic','Vegetables cooked with Thai basil and fresh r','Berco\'s',18,'Meal Bowl'),(54,'Bercos Classic Paneer Meal Bowl','Cottage cheese cooked with premium soya, fres','Berco\'s',20,'Meal Bowl'),(55,'Chicken Soggy Basil Bowl - Thai Classi','Chicken Soggy Basil Bowl - Thai Classi','Berco\'s',10,'Meal Bowl'),(56,'Chicken Bangkok Bowl with Steam Rice','Chicken Bangkok Bowl with Steam Rice','Berco\'s',20,'Meal Bowl'),(57,'Chicken Szechuan Pan Fried Noodles Bowl','Sliced chicken served with pan fried noodles','Berco\'s',25,'Meal Bowl'),(58,'Veg Steamed Dimsum','Veg Steamed Dimsum','Berco\'s',10,'Momos'),(59,'Non Veg Momos','Chicken Steamed Dimsum','Berco\'s',12,'Momos'),(60,'Chicken Pan Fried Dimsum','Chicken Pan Fried Dimsum','Berco\'s',15,'Momos'),(61,'Veg Pan Fried Dimsum','Veg Pan Fried Dimsum','Berco\'s',13,'Momos');
/*!40000 ALTER TABLE `ITEMS` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-14  4:46:45
