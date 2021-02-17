USE tracker_db;

/*Insert four rows in the department table*/
INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO department (name)
VALUES ("Logistics");

INSERT INTO department (name)
VALUES ("Software");

INSERT INTO department (name)
VALUES ("Finance");

-- Roles in Engineering Department
INSERT INTO role (title, salary, department_id)					-- role id 1
VALUES ("Engineering Manager", 18000, 1);	

INSERT INTO role (title, salary, department_id)					-- role id 2
VALUES ("Computer Engineer", 15000, 1);

INSERT INTO role (title, salary, department_id)					-- role id 3
VALUES ("Electronics Engineer", 14000, 1);

INSERT INTO role (title, salary, department_id)					-- role id 4
VALUES ("Firmware Engineer", 14000, 1);

-- Roles in Logistics Department
INSERT INTO role (title, salary, department_id)					-- role id 5
VALUES ("Purchaser", 10000, 2);

INSERT INTO role (title, salary, department_id)					-- role id 6
VALUES ("Storeman", 7000, 2);

INSERT INTO role (title, salary, department_id)					-- role id 7
VALUES ("Warehouse Assistant", 6000, 2);

 -- Roles in Software Department
INSERT INTO role (title, salary, department_id)					-- role id 8
VALUES ("Software Manager", 18000, 3);

INSERT INTO role (title, salary, department_id)					-- role id 9
VALUES ("Full Stack Developer", 12000, 3);

INSERT INTO role (title, salary, department_id)					-- role id 10
VALUES ("Database Developer", 10000, 3);

INSERT INTO role (title, salary, department_id)					-- role id 11
VALUES ("Front End Developer", 10000, 3);

-- Roles in Finance Department
INSERT INTO role (title, salary, department_id)					-- role id 12
VALUES ("Accounting Manager", 20000, 4);

INSERT INTO role (title, salary, department_id)					-- role id 13
VALUES ("Payroll Officer", 12000, 4);

INSERT INTO role (title, salary, department_id)					-- role id 14
VALUES ("Accounting Assistant", 10000, 4);

INSERT INTO role (title, salary, department_id)					-- role id 15
VALUES ("Accounting Assistant", 10000, 4);


INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Peter", "Dave", 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Alex", "Lam", 3, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jim", "Lopez", 13, 12);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Maricar", "Diaz", 11, 8);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Philip", "Laroza", 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jason", "Cabral", 4, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jim", "Chua", 2, 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Junar", "Mendoza", 8);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Janet", "Price", 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Mark", "Jamison", 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Steph", "Nadal", 9, 8);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Jerome", "LaCosta", 12);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Theresa", "Chuatico", 10, 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Shane", "Mill", 14, 12);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Margie", "Cadaba", 15, 12);

