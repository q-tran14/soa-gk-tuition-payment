CREATE DATABASE Tuition_management;
USE Tuition_management;

CREATE TABLE Tuition(
	TuitionID INT PRIMARY KEY IDENTITY(1, 1),
	TuitionName NVARCHAR(255) NOT NULL,
	TuitionAmount DECIMAL(18, 2) NOT NULL,
	Semester NVARCHAR(255),
	Year INT NOT NULL,
	EndDate DATE NULL
);