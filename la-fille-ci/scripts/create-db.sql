-- Cree la base `lafilleci` pour Prisma.
-- InnoDB est indispensable : Prisma a besoin des cles etrangeres et des transactions.
-- Le moteur par defaut de ce serveur WAMP est MyISAM, il faut donc le forcer :
--   SET GLOBAL default_storage_engine = InnoDB;   (mysqld.cnf / my.ini : default_storage_engine=InnoDB)
DROP DATABASE IF EXISTS `lafilleci`;
CREATE DATABASE `lafilleci`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;