-- Optional: Spring Boot creates the database and tables automatically (ddl-auto=update).
-- Run this only if you prefer to create the empty database yourself or need a dedicated user.
CREATE DATABASE IF NOT EXISTS rageforge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- CREATE USER 'rageforge'@'localhost' IDENTIFIED BY 'change-me';
-- GRANT ALL PRIVILEGES ON rageforge.* TO 'rageforge'@'localhost';
-- Products and categories are loaded from database/catalog.json on first start (CatalogSeeder).
