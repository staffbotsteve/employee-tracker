DROP DATABASE IF EXISTS employeesDB;

CREATE DATABASE employeesDB;

USE employeesDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title	VARCHAR(30)	NOT NULL,
  salary DECIMAL NOT NULL
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name	VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  department_id	INT NULL,
  manager_id INT NULL,
  INDEX role_ind (role_id),
  INDEX man_ind (manager_id),
  INDEX dep_ind (department_id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE,
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
);
 
SELECT * FROM department; 
SELECT * FROM role;
SELECT * FROM employee;

-- INSERT INTO department (name)
-- VALUES ("Human Resources");

-- INSERT INTO department (name)
-- VALUES ("Software Development");

-- INSERT INTO department (name)
-- VALUES ("Operations");

-- DELETE FROM department WHERE id = 1 ; 
-- SELECT * FROM department; 
-- SELECT * FROM role;


-- INSERT INTO role (title, salary)
-- VALUES ("Manager", 80000);

-- INSERT INTO role (title, salary)
-- VALUES ("Supervisor", 60000);

-- INSERT INTO role (title, salary)
-- VALUES ("Developer 1", 500000);

-- INSERT INTO role (title, salary)
-- VALUES ("Developer 2", 1000000);

-- SELECT * FROM role;
-- DELETE FROM role WHERE id = 4 ; 
-- SELECT * FROM employee;

-- INSERT INTO employee  (first_name, last_name, role_id, manager_id)
-- VALUES  
-- ('John', 'Doe', 1, NULL),    
-- ('Ashley', 'Rodriguez', 2, NULL),
-- ('Kevin', 'Tupik', 3, NULL),
-- ('Kunal', 'Singh', 4, NULL);

