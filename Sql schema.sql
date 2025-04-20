-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: job_tracker
-- ------------------------------------------------------
-- Server version	8.0.42

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

--
-- Table structure for table `jobapplications`
--

DROP TABLE IF EXISTS `jobapplications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobapplications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `companyName` varchar(255) NOT NULL,
  `jobTitle` varchar(255) NOT NULL,
  `jobLocation` varchar(255) DEFAULT NULL,
  `jobType` enum('Full-time','Part-time','Internship','Contract') DEFAULT 'Full-time',
  `applicationDate` date DEFAULT NULL,
  `status` enum('Applied','Interviewing','Offered','Rejected') DEFAULT 'Applied',
  `salary` varchar(100) DEFAULT NULL,
  `notes` text,
  `createdBy` int(10) unsigned zerofill NOT NULL,
  `updatedBy` int(10) unsigned zerofill NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobapplications`
--

LOCK TABLES `jobapplications` WRITE;
/*!40000 ALTER TABLE `jobapplications` DISABLE KEYS */;
INSERT INTO `jobapplications` VALUES (1,'xyz','fullstack','hyd','Full-time','2025-04-15','Applied','360000','nothing 2a',0000000000,0000000000,'2025-04-19 00:39:23','2025-04-20 10:45:33'),(3,'ZOHO','MERN','GDR','Part-time','2025-04-20','Rejected','360000','nothing45',0000000003,0000000003,'2025-04-19 13:42:15','2025-04-20 02:21:15'),(7,'TCS','MERN STACK','CHENNAI','Full-time','2025-04-20','Applied','600000','WITH GOOD SKILLS',0000000000,0000000000,'2025-04-20 02:17:59','2025-04-20 02:17:59'),(8,'kkk','oo','jjj','Contract','2025-04-23','Applied','60000','kk',0000000000,0000000000,'2025-04-20 02:44:54','2025-04-20 02:44:54');
/*!40000 ALTER TABLE `jobapplications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `lastName` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phoneNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdBy` int NOT NULL,
  `updatedBy` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'saikumar','janagari','saikumar@gmail.com','Sai@6303','6303461088',0,0,'2025-04-19 00:37:23','2025-04-19 00:37:23'),(2,'chaithu','janagari','sai@gmail.com','$2b$10$Xo0TzXrijYmYh/9ECKE4g.W7Pfh4hdHhHcSjaG6U9hb9N0uu62tyO',NULL,1,1,'2025-04-19 00:37:23','2025-04-19 00:37:23'),(3,'Babu','kakani','Babu@gmail.com','$2b$10$s02K8x4y5U0d6hppE5FcOuqWaafNIFsqWMHbOW/lO7jWHJXnVzaLC','6303461055',1,1,'2025-04-19 00:37:23','2025-04-19 00:37:23');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-20 16:28:23
