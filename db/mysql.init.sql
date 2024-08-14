-- MySQL dump 10.13  Distrib 8.4.2, for Linux (x86_64)
--
-- Host: localhost    Database: parking_system
-- ------------------------------------------------------
-- Server version	8.4.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assignment`
--

DROP TABLE IF EXISTS `assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment` (
  `id` varchar(255) NOT NULL,
  `slot_id` varchar(255) DEFAULT NULL,
  `employee_id` varchar(255) DEFAULT NULL,
  `assignment_date` datetime DEFAULT NULL,
  `schedule_id` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `slot_id` (`slot_id`),
  KEY `employee_id` (`employee_id`),
  KEY `schedule_id` (`schedule_id`),
  CONSTRAINT `assignment_ibfk_1` FOREIGN KEY (`slot_id`) REFERENCES `slot` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `assignment_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `assignment_ibfk_3` FOREIGN KEY (`schedule_id`) REFERENCES `schedule` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment`
--

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`administrator`@`%`*/ /*!50003 TRIGGER `de_assignment_action` AFTER UPDATE ON `assignment` FOR EACH ROW BEGIN
    IF OLD.status <> NEW.status AND NEW.status = 'INACTIVO' THEN
        UPDATE schedule SET status = 'INACTIVO' WHERE id = NEW.schedule_id;
        UPDATE assignment_loan SET status = 'INACTIVO' WHERE assignment_id = NEW.id;
        UPDATE slot SET status = 'DISPONIBLE' WHERE id = NEW.slot_id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `assignment_loan`
--

DROP TABLE IF EXISTS `assignment_loan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_loan` (
  `id` varchar(255) NOT NULL,
  `assignment_id` varchar(255) NOT NULL,
  `employee_id` varchar(255) NOT NULL,
  `start_date_assignment` date NOT NULL,
  `end_date_assignment` date NOT NULL,
  `assignment_date` date NOT NULL,
  `status` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `assignment_id` (`assignment_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `assignment_loan_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `assignment_loan_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment_loan`
--

LOCK TABLES `assignment_loan` WRITE;
/*!40000 ALTER TABLE `assignment_loan` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment_loan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment_tag_detail`
--

DROP TABLE IF EXISTS `assignment_tag_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_tag_detail` (
  `id` varchar(255) NOT NULL,
  `assignment_id` varchar(255) NOT NULL,
  `tag_id` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `tagId` varchar(255) DEFAULT NULL,
  `assignmentId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `assignment_tag_detail_tagId_assignmentId_unique` (`tagId`,`assignmentId`),
  KEY `assignment_id` (`assignment_id`),
  KEY `tag_id` (`tag_id`),
  KEY `assignmentId` (`assignmentId`),
  CONSTRAINT `assignment_tag_detail_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`id`),
  CONSTRAINT `assignment_tag_detail_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`),
  CONSTRAINT `assignment_tag_detail_ibfk_3` FOREIGN KEY (`tagId`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assignment_tag_detail_ibfk_4` FOREIGN KEY (`assignmentId`) REFERENCES `assignment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment_tag_detail`
--

LOCK TABLES `assignment_tag_detail` WRITE;
/*!40000 ALTER TABLE `assignment_tag_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment_tag_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `de_assignment`
--

DROP TABLE IF EXISTS `de_assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `de_assignment` (
  `id` varchar(255) NOT NULL,
  `assignment_id` varchar(255) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `de_assignment_date` datetime NOT NULL,
  `is_rpa_action` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `de_assignment`
--

LOCK TABLES `de_assignment` WRITE;
/*!40000 ALTER TABLE `de_assignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `de_assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount_note`
--

DROP TABLE IF EXISTS `discount_note`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_note` (
  `id` varchar(255) NOT NULL,
  `assignment_id` varchar(255) NOT NULL,
  `status_signature` enum('PENDIENTE','APROBADO','RECHAZADO','CANCELADO') DEFAULT 'PENDIENTE',
  `status_dispatched` enum('EXITOSO','FALLIDO','PENDIENTE','REINTENTANDO') DEFAULT 'PENDIENTE',
  `last_notice` datetime DEFAULT NULL,
  `next_notice` datetime DEFAULT NULL,
  `reminder_frequency` int DEFAULT '2',
  `dispatch_attempts` int DEFAULT '0',
  `max_dispatch_attempts` int DEFAULT '3',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `assignment_id` (`assignment_id`),
  CONSTRAINT `discount_note_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_note`
--

LOCK TABLES `discount_note` WRITE;
/*!40000 ALTER TABLE `discount_note` DISABLE KEYS */;
/*!40000 ALTER TABLE `discount_note` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `id` varchar(255) NOT NULL,
  `code_employee` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `workplace` varchar(255) DEFAULT NULL,
  `identifier_document` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `sub_management` varchar(255) DEFAULT NULL,
  `management_1` varchar(255) DEFAULT NULL,
  `management_2` varchar(255) DEFAULT NULL,
  `work_site` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `access_token_status` enum('ACTIVO','INACTIVO') DEFAULT 'INACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_employee` (`code_employee`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `contact_reference` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `latitude` float DEFAULT '0',
  `longitude` float DEFAULT '0',
  `status` enum('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `id` varchar(255) NOT NULL,
  `slot_id` varchar(255) NOT NULL,
  `start_time_assignment` time NOT NULL,
  `end_time_assignment` time NOT NULL,
  `status` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `slot_id` (`slot_id`),
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`slot_id`) REFERENCES `slot` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setting`
--

DROP TABLE IF EXISTS `setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setting` (
  `id` varchar(255) NOT NULL,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setting`
--

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES ('895b40e8-2fbf-4312-bd2e-15aa3ae96c82','WS_EMPLOYEES','https://jsonplaceholder.typicode.com/users','Web service','2024-08-13 00:00:00','2024-08-13 00:00:00');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slot`
--

DROP TABLE IF EXISTS `slot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `slot` (
  `id` varchar(255) NOT NULL,
  `location_id` varchar(255) NOT NULL,
  `slot_number` varchar(255) NOT NULL,
  `slot_type` enum('SIMPLE','MULTIPLE') DEFAULT 'SIMPLE',
  `limit_schedules` int NOT NULL DEFAULT '1',
  `vehicle_type` enum('CARRO','MOTO','CAMION') DEFAULT 'CARRO',
  `cost_type` enum('SIN_COSTO','DESCUENTO','COMPLEMENTO') DEFAULT 'SIN_COSTO',
  `cost` float DEFAULT '0',
  `status` enum('DISPONIBLE','OCUPADO','INACTIVO') DEFAULT 'DISPONIBLE',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `slot_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slot`
--

LOCK TABLES `slot` WRITE;
/*!40000 ALTER TABLE `slot` DISABLE KEYS */;
/*!40000 ALTER TABLE `slot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle`
--

DROP TABLE IF EXISTS `vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle` (
  `id` varchar(255) NOT NULL,
  `employee_id` varchar(255) NOT NULL,
  `vehicle_badge` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `type` enum('CARRO','MOTO','CAMION') DEFAULT 'CARRO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `vehicle_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle`
--

LOCK TABLES `vehicle` WRITE;
/*!40000 ALTER TABLE `vehicle` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-13 18:47:21
