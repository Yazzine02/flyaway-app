-- Creates one database per microservice (Database-per-Service pattern).
-- Executed automatically by the official postgres image on first startup.
CREATE DATABASE travel_user_db;
CREATE DATABASE travel_flight_db;
CREATE DATABASE travel_hotel_db;
CREATE DATABASE travel_reservation_db;
