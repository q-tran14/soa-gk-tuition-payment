create database CUSTOMER_SOA_GK
go
use CUSTOMER_SOA_GK
go

CREATE TABLE Customer (
    CustomerID VARCHAR(255) PRIMARY KEY,
    CustomerFullName NVARCHAR(100) NOT NULL,
    CustomerEmail NVARCHAR(100) UNIQUE NOT NULL,
	CustomerPassword VARCHAR(255) NOT NULL,
    CustomerPhone CHAR(10),
    CustomerBalance DECIMAL(12,2) DEFAULT 0
);
go
CREATE TABLE Student (
    StudentID INT IDENTITY(1,1) PRIMARY KEY,
    StudentFullName NVARCHAR(100) NOT NULL,
    StudentEmail VARCHAR(255) NOT NULL UNIQUE,
    StudentPhone VARCHAR(20) NULL,
    StudentTuitionCode VARCHAR(50)  UNIQUE
  );

SELECT * FROM Customer;
go
SELECT * FROM Student;
go