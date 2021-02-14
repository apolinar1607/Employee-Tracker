-- Schema for Department database 
DROP DATABASE IF EXISTS tracker_db;

-- Create database department
CREATE DATABASE tracker_db;

-- Use created database to create table
USE tracker_db;

CREATE TABLE department (
	id INTEGER(10) AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE role (
	id INTEGER(10) AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL(12,4),
    department_id INTEGER NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE employee (
	id INTEGER(10) AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INTEGER NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(role_id) REFERENCES role(id),
    FOREIGN KEY(manager_id) REFERENCES role(id)
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
