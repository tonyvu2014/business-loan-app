CREATE DATABASE
IF NOT EXISTS `demyst` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE demyst;

CREATE TABLE
IF NOT EXISTS `accounting_provider`
(
  `id` int
(10) NOT NULL AUTO_INCREMENT,
  `name` varchar
(100) NOT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE
IF NOT EXISTS `loan_application`
(
  `id` int
(10) NOT NULL AUTO_INCREMENT,
  `business_name` varchar
(200) NOT NULL,
  `business_abn` varchar
(20) NOT NULL,
  `loan_amount` decimal
(15,2) NOT NULL,
  `status` enum
('DRAFT','PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'DRAFT',
  `year_established` year
(4) DEFAULT NULL,
  `accounting_provider` varchar
(100) NOT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;