const inquirer = require("inquirer");
const connection = require("./assets/connection");
const cTable = require("console.table");

const employeeMenu = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add departments",
        "Add roles",
        "Add employees",
        "View departments",
        "View department's budget",
        "View roles",
        "View employees",
        "View employees by Manager",
        "Change Employees Manager",
        "Update employee roles",
        "Delete an employee",
        "Delete a role",
        "Delete a department",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "Add departments":
          addDepartment();
          break;
        case "Add roles":
          addRole();
          break;
        case "Add employees":
          addEmployee();
          break;
        case "View departments":
          viewDepartments();
          break;
        case "View department's budget":
          viewDeptBudget();
          break;
        case "View roles":
          viewRoles();
          break;
        case "View employees":
          viewEmployees();
          break;
        case "View employees by Manager":
          viewEmpManager();
          break;
        case "Change Employees Manager":
          changeEmpManager();
          break;
        case "Update employee roles":
          updateEmployeeRole();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Delete a department":
          deleteDepartment();
          break;
      }
    });
};
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "Enter the department name",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        [
          {
            name: answer.departmentName,
          },
        ],
        (err, results) => {
          if (err) throw err;
          console.log("Department added");
        }
      );
      employeeMenu();
    });
};
const addRole = () => {
  inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "Enter the role title",
      },
      {
        name: "roleSalary",
        type: "input",
        message: "Enter the role's salary",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO role SET ?",
        [
          {
            title: answer.roleTitle,
            salary: answer.roleSalary,
          },
        ],
        (err, results) => {
          if (err) throw err;
          console.log("Role added");
        }
      );
      employeeMenu();
    });
};
const addEmployee = () => {
  connection.query("SELECT id, title FROM role", (err, result) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employees first name?",
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employees last name?",
        },
        {
          type: "list",
          name: "roleId",
          message: "What is the employees role",
          choices: function () {
            let choiceArray = result.map(
              (choice) => choice.id + " " + choice.title
            );
            return choiceArray;
          },
        },
      ])
      .then((res) => {
        let roleSelect = res.roleId.split(" ");
        //console.log(res);
        connection.query("SELECT id, name FROM department", (err, result) => {
          if (err) throw err;
          //console.log(result);
          inquirer
            .prompt({
              type: "list",
              name: "departmentId",
              message: "What is the employees department?",
              choices: function () {
                let deptArray = result.map(
                  (choice) => choice.id + " " + choice.name
                );
                return deptArray;
              },
            })
            .then((answer) => {
              // console.log(res);
              // console.log(answer);
              let deptSelect = answer.departmentId.split(" ");
              //console.log(typeof(roleSelect[0]))
              if (roleSelect[0] === "1") {
                //console.log("is Manager? == 1?",roleSelect[0])
                connection.query(
                  "INSERT INTO employee (first_name, last_name, role_id, department_id) VALUES (?, ?, ?, ?)",
                  [res.firstName, res.lastName, roleSelect[0], deptSelect[0]],
                  (err, data) => {
                    //console.log(data);
                    if (err) throw err;
                    console.table("Successfully Inserted");
                    employeeMenu();
                  }
                );
              } else {
                //console.log("not manager? num > 1", roleSelect[0])
                connection.query(
                  "SELECT id, first_name, last_name FROM employee WHERE role_id = 1",
                  (err, result) => {
                    if (err) throw err;
                    //console.log(result);
                    inquirer
                      .prompt({
                        type: "list",
                        name: "managerId",
                        message: "Who is managing this employee?",
                        choices: function () {
                          let mngrArray = result.map(
                            (choice) =>
                              choice.id +
                              " " +
                              choice.first_name +
                              " " +
                              choice.last_name
                          );
                          return mngrArray;
                        },
                      })
                      .then((answer) => {
                        let mngrSelect = answer.managerId.split(" ");
                        connection.query(
                          "INSERT INTO employee (first_name, last_name, role_id, department_id, manager_id) VALUES (?, ?, ?, ?, ?)",
                          [
                            res.firstName,
                            res.lastName,
                            roleSelect[0],
                            deptSelect[0],
                            mngrSelect[0],
                          ],
                          (err, data) => {
                            //console.log(data);
                            if (err) throw err;
                            console.table("Successfully Inserted");
                            employeeMenu();
                          }
                        );
                      });
                  }
                );
              }
            });
        });
      });
  });
};

const viewEmployees = () => {
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
    console.table(results);
    employeeMenu();
  });
};

const viewEmpManager = () => {
  connection.query(
    "SELECT id, first_name, last_name FROM employee WHERE role_id = 1",
    (err, results) => {
      if (err) throw err;
      inquirer
        .prompt({
          name: "employeeName",
          type: "list",
          message: "Select the manager in order to see their employee's",
          choices: function () {
            let choiceArray = results.map(
              (choice) =>
                choice.id + " " + choice.first_name + " " + choice.last_name
            );
            return choiceArray;
          },
        })
        .then((answer) => {
          let mngrSelect = answer.employeeName.split(" ");
          connection.query(
            "SELECT id, first_name, last_name FROM employee WHERE manager_id = " +
              mngrSelect[0],
            (err, data) => {
              if (err) throw err;
              console.table(data);
              employeeMenu();
            }
          );
        });
    }
  );
};

const changeEmpManager = () => {
  connection.query(
    "SELECT id, first_name, last_name FROM employee WHERE role_id != 1",
    (err, results) => {
      if (err) throw err;
      inquirer
        .prompt({
          name: "employeeName",
          type: "list",
          message:
            "Please select the employee whom you want to reassign their Manager",
          choices: function () {
            let choiceArray = results.map(
              (choice) =>
                choice.id + " " + choice.first_name + " " + choice.last_name
            );
            return choiceArray;
          },
        })
        .then((answer) => {
          let empSelect = answer.employeeName.split(" ");
          connection.query(
            "SELECT id, first_name, last_name FROM employee WHERE role_id = 1",
            (err, data) => {
              if (err) throw err;
              inquirer
                .prompt({
                  name: "managerName",
                  type: "list",
                  message: "Please select the Manager for this employee",
                  choices: function () {
                    let choiceArray = data.map(
                      (choice) =>
                        choice.id +
                        " " +
                        choice.first_name +
                        " " +
                        choice.last_name
                    );
                    return choiceArray;
                  },
                })
                .then((answer) => {
                  let mngrSelect = answer.managerName.split(" ");
                  connection.query(
                    "UPDATE employee SET manager_id = ? WHERE id = ?",
                    [mngrSelect[0], empSelect[0]],
                    (err, data) => {
                      if (err) throw err;
                      console.log("Employee's manager has been updated!");
                      employeeMenu();
                    }
                  );
                });
            }
          );
        });
    }
  );
};

const viewDepartments = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    console.table(results);
    employeeMenu();
  });
};

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const viewDeptBudget = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt({
        name: "departmentName",
        type: "list",
        message: "Please select the department you want to view the budget for",
        choices: function () {
          let choiceArray = results.map(
            (choice) =>
              choice.id + " " + choice.name
          );
          return choiceArray;
        },
      })
      .then((answer) => {
        let deptSelect = answer.departmentName.split(" ");
        connection.query(
          "SELECT * FROM employee INNER JOIN role WHERE role_id = role.id && department_id = ?",
          [deptSelect[0]],
          (err, data) => {
            if (err) throw err;
            let totalSalary = 0;
            data.forEach(budget => {
              totalSalary += budget.salary
            });
            console.log(`The total budget for ${answer.departmentName} is ${formatter.format(totalSalary)}`);
            employeeMenu();
          }
        );
      });
  });
};

const viewRoles = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    console.table(results);
    employeeMenu();
  });
};
const updateEmployeeRole = () => {
  let employeeID;
  let roleID;
  connection.query(
    "SELECT id, first_name, last_name FROM employee",
    (err, result) => {
      if (err) throw err;
      inquirer
        .prompt({
          name: "employeeName",
          type: "list",
          message: "Which employee's role would you like to update?",
          choices: function () {
            let choiceArray = result.map(
              (choice) =>
                choice.id + " " + choice.first_name + " " + choice.last_name
            );
            return choiceArray;
          },
        })
        .then((answer) => {
          let getID = answer.employeeName.split(" ");
          employeeID = getID[0];
          connection.query("SELECT id, title FROM role", (err, result) => {
            if (err) throw err;
            inquirer
              .prompt({
                name: "employeeRole",
                type: "list",
                message: "What is the employee's new role?",
                choices: function () {
                  let choiceArray = result.map(
                    (choice) => choice.id + " " + choice.title
                  );
                  return choiceArray;
                },
              })
              .then((answer) => {
                let getRoleID = answer.employeeRole.split(" ");
                roleID = getRoleID[0];
                connection.query(
                  "UPDATE employee SET role_id = ? WHERE id = ?",
                  [roleID, employeeID],
                  (err, results) => {
                    if (err) throw err;
                    console.log("Role Changed!");
                    employeeMenu();
                  }
                );
              });
          });
        });
    }
  );
};
const deleteEmployee = () => {
  connection.query("SELECT * FROM employee", (err, result) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employeeName",
          type: "list",
          message: "Select Employee you want to fire !",
          choices: function () {
            let choiceArray = result.map(
              (choice) =>
                choice.id + " " + choice.first_name + " " + choice.last_name
            );
            return choiceArray;
          },
        },
      ])
      .then((answer) => {
        let firedID = answer.employeeName.split(" ");
        connection.query(
          "DELETE FROM employee WHERE id = ?",
          [firedID[0]],
          (err, results) => {
            if (err) throw err;
            console.log("Employee is deleted");
            employeeMenu();
          }
        );
      });
  });
};
const deleteRole = () => {
  connection.query("SELECT * FROM role", (err, result) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "role",
          type: "list",
          message: "Select role you want to remove",
          choices: function () {
            let choiceArray = result.map(
              (choice) => choice.id + " " + choice.title + " " + choice.salary
            );
            return choiceArray;
          },
        },
      ])
      .then(function (answer) {
        let roleID = answer.role.split(" ");
        connection.query(
          "DELETE FROM role WHERE id = ?",
          [roleID[0]],
          (err, results) => {
            if (err) throw err;
            console.log("Role has been removed");
            employeeMenu();
          }
        );
      });
  });
};
const deleteDepartment = () => {
  connection.query("SELECT * FROM department", (err, result) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "department",
          type: "list",
          message: "Select department you want to remove",
          choices: function () {
            let choiceArray = result.map(
              (choice) => choice.id + " " + choice.name
            );
            return choiceArray;
          },
        },
      ])
      .then((answer) => {
        let departmentID = answer.department.split(" ");
        connection.query(
          "DELETE FROM department WHERE id = ?",
          [departmentID[0]],
          (err, results) => {
            if (err) throw err;
            console.log("Department has been removed");
            employeeMenu();
          }
        );
      });
  });
};

employeeMenu();