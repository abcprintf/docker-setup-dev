/* init-db.sql */
CREATE DATABASE [my-db];
USE [my-db];
CREATE TABLE [User] (
  Id INT NOT NULL IDENTITY(1,1),
  FirstName VARCHAR(50) NOT null,
  LastName VARCHAR(50) NOT NULL,
  DateOfBirth DATETIME NOT NULL
  CONSTRAINT PK_User_Id PRIMARY KEY (Id ASC)
);
INSERT INTO [User] VALUES ('Jose', 'Realman', '2018-01-01');