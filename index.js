var mysql = require("mysql");
var inquirer = require('inquirer');

// this is what i will use for the prompts
// inquirer
//   .prompt([
//     /* Pass your questions in here */
//   ])
//   .then(answers => {
//     // Use user feedback for... whatever!!
//   })
//   .catch(error => {
//     if(error.isTtyError) {
//       // Prompt couldn't be rendered in the current environment
//     } else {
//       // Something else when wrong
//     }
//   });

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

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  // createEmployee();
});

function createEmployee() {
    console.log("Inserting a new employee...\n");
    var query = connection.query(
      "INSERT INTO employee SET ?" + 
      {
        first_name: "PROMPT",
        last_name:  "PROMPT",
        role_id:  "PROMPT",
        manager_id:  "PROMPT"
      },
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " product inserted!\n");
        // Call updateEmployee AFTER the INSERT completes
        // updateEmployee();
      }
    )};
