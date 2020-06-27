var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "employeesDB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  employeeMenu();
});

function employeeMenu() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add departments, roles, employees",
        "View departments, roles, employees",
        "Update employee roles"]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Add departments, roles, employees":
          addEmployee();
          break;

        case "View departments, roles, employees":
          viewEmployee();
          break;

        case "Update employee roles":
          updateEmployeeRole();
          break;
      }
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "employeeFirstName",
        type: "input",
        message: "Enter the employee's first name",
      },
      {
        name: "employeeLastName",
        type: "input",
        message: "Enter the employee's last name",
      },
      {
        name: "employeeRole",
        type: "input",
        message: "Enter the employee's role id",
      },
      {
        name: "employeeDepartment",
        type: "input",
        message: "Enter the employee's department number",
      }

    ])
    .then(function (answer) {
      // based on their answer
      connection.query("INSERT INTO employee SET ?",

      [{
        first_name: answer.employeeFirstName, last_name: answer.employeeLastName, role_id: Number(answer.employeeRole),
        department_id: Number(answer.employeeRole)
      }],
      
      function (err, results) {
        if (err) throw err;
        console.log('Employee added')
      })
    });
}
