const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Maranatha269872',
    database: 'tracker_db'
});

connection.connect(err => {
    if (err) throw err;
    console.log(`

#############################
EMPLOYEE TRACKER APPLICATION
#############################

`);
    runTracker();
});

const runTracker = () => {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'View All Departments',
            'View All Roles',
            'View All Employees By Department',
            'View All Employees By Manager',
            'Add Employee',
            'Add Role',
            'Add Department',
            'Remove Employee',
            'Remove Role',
            'Remove Department',
            'Update Employee Role',
            'Exit'
        ]
    })
    .then((answer) => {
        switch (answer.action){
            case 'View All Employees': 
                viewAll();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees By Department':
                viewByDepartment();
                break;
            case 'View All Employees By Manager':
                viewByManager();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Remove Role':
                removeRole();
                break;
            case 'Remove Department':
                removeDepartment();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                break;
            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    });
 
};
 //TO VIEW ALL EMPLOYEES
const viewAll = () => {
    connection.query(`SELECT employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        department.name AS department, 
                        role.salary, 
                        CONCAT(manager.first_name,' ',manager.last_name) AS manager
                      FROM employee 
                      LEFT JOIN role ON employee.role_id = role.id 
                      LEFT JOIN department ON role.department_id = department.id 
                      LEFT JOIN employee manager ON  employee.manager_id = manager.id `, (err, res) => {
                                 if (err) throw err;
                                 console.log("\n");
                                 console.table(res);
                                 runTracker();
    })
}
//TO VIEW ALL DEPARTMENTS
const viewAllDepartments = () => {
    const depQuery = `SELECT * FROM department`
    connection.query(depQuery, (err, data) => {
      if (err) throw err;
      console.table(data);
      runTracker();
    })
  };

//TO VIEW ALL ROLES
const viewAllRoles = () => {
    const roleQuery = `SELECT * FROM role`
    connection.query(roleQuery, (err, data) => {
      if (err) throw err;
      console.table(data);
      runTracker();
    })
  };

//TO DISPLAY EMPLOYEES BY DEPARTMENT
const viewByDepartment = () => {
        const depQuery1 = ('SELECT * FROM department');
        connection.query(depQuery1, (err, res) => {
            const departments = res.map(element => {
                return {name: `${element.name}`}
            });
    inquirer.prompt ({
        name: 'deptSelect',
        type: 'list',
        message: 'Select a Department to view employees:',
        choices: departments
    }).then(answer => {
        const depQuery2 = ` SELECT employee.id, 
                                employee.first_name, 
                                employee.last_name, 
                                role.title, 
                                department.name AS department, 
                                role.salary, 
                                CONCAT(manager.first_name,' ',manager.last_name) AS manager
                            FROM employee 
                            LEFT JOIN role ON employee.role_id = role.id 
                            LEFT JOIN department ON role.department_id = department.id 
                            LEFT JOIN employee manager ON employee.manager_id = manager.id
                            WHERE ?`
        connection.query(depQuery2, [{name: answer.deptSelect}], (err, res) => {
            if (err) throw err;
            console.log("\n");
            console.table(res);
            runTracker();
          })
     })
  })
}

//TO DISPLAY EMPLOYEES BY MANAGER
const viewByManager = () => {
    const managerQuery1 = `SELECT *
                           FROM employee e
                           WHERE e.manager_id IS NULL`
    connection.query(managerQuery1, (err, res) => {
        const managers = res.map(element =>{
            return {
                name:  `${element.first_name} ${element.last_name}`,
                value: element.id
            }
        });
        inquirer.prompt({
            name: 'managerSelect',
            type: 'list',
            message: 'Select a Manager to view Employees',
            choices: managers
        }).then (answer => {
            const managerQuery2 = `SELECT employee.id, 
                                    employee.first_name, 
                                    employee.last_name, 
                                    role.title, 
                                    department.name AS department, 
                                    role.salary, 
                                    CONCAT(manager.first_name,' ',manager.last_name) AS manager
                                  FROM employee 
                                  LEFT JOIN role ON employee.role_id = role.id 
                                  LEFT JOIN department ON role.department_id = department.id 
                                  LEFT JOIN employee manager ON employee.manager_id = manager.id
                                  WHERE employee.manager_id = ?`
            connection.query(managerQuery2, [answer.managerSelect], (err, res) => {
                if (err) throw err;
                console.log('\n');
                console.table(res);
                runTracker();
            })
        })
    })
}

//TO ADD EMPLOYEE
const addEmployee = () => {
    const addQuery = `SELECT employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        employee.role_id, 
                        role.title, 
                        department.name,
                        role.salary, 
                        employee.manager_id 
                    FROM employee
                    INNER JOIN role on role.id = employee.role_id
                    INNER JOIN department ON department.id = role.department_id`
    connection.query(addQuery, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
              type: "input",
              name: "first_name",
              message: "Please enter employee first name"
            }, {
              type: "input",
              name: "last_name",
              message: "Please enter employee last name"
            }, {
              type: "list",
              name: "role",
              message: "Please select employee title",
              choices: res.map(role => {
                return { name: role.title, value: role.role_id }
              })
            }, {
              type: "input",
              name: "manager",
              message: "Please enter employee manager id"
            }])
            .then(answer => {
              console.log(answer);
              connection.query(
                "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
                [answer.first_name, answer.last_name, answer.role, answer.manager],(err) => {
                  if (err) throw err
                  console.log(`${answer.first_name} ${answer.last_name} added as a new employee`)
                  runTracker();
                })
            })
        })
      };


//TO ADD A NEW ROLE
const addRole = () => {
        let query1 = `SELECT * FROM role`
        connection.query(query1, (err, data) => {
          if (err) throw err
          inquirer.prompt([
            {
              type: "input",
              name: "roleId",
              message: "Please enter id for new role"
            }, {
              type: "input",
              name: "role",
              message: "Please enter title of new role"
            }, {
              type: "input",
              name: "salary",
              message: "Please enter salary for new role"
            }, {
              type: "input",
              name: "deptId",
              message: "Please enter department id for new role"
            }])
            .then((answers) => {
              let query2 = `INSERT INTO role VALUES (?,?,?,?)`
              connection.query(query2, [answers.roleId, answers.role, answers.salary, answers.deptId], (err) => {
                if (err) throw err;
                console.log(`${answers.role} added as new role`)
                runTracker();
              })
            })
        })
      };

//TO REMOVE A ROLE

const removeRole = () => {
    let query1 = `SELECT * FROM role`
    connection.query(query1, (err, res) => {
      if (err) throw err;
      inquirer.prompt([{
        type: "list",
        name: "roleId",
        message: "Please select role to remove",
        choices: res.map(roles => {
          return { name: `${roles.title}`, value: roles.id }
        })
      }])
        .then(answer => {
          let query2 = `DELETE FROM role WHERE ?`
          connection.query(query2, [{ id: answer.roleId }], (err) => {
            if (err) throw err;
            console.log("Role removed");
            runTracker();
          })
        })
    })
  };
      
//TO ADD A NEW DEPARTMENT
const addDepartment = () => {
        let query1 = `SELECT * FROM department`
        connection.query(query1, (err, res) => {
          if (err) throw err
          inquirer.prompt([{
            type: "input",
            name: "deptId",
            message: "Please enter id for new department"
          }, {
            type: "input",
            name: "deptName",
            message: "Please enter name for new department"
          }])
            .then(answers => {
              let query2 = `INSERT INTO department VALUES (?,?)`
              connection.query(query2, [answers.deptId, answers.deptName], (err) => {
                if (err) throw err
                console.log(`${answers.deptName} added as a new department`)
                runTracker();
              })
            })
        })
      };

//REMOVE A DEPARTMENT
const removeDepartment = () => {
    let query1 = `SELECT * FROM department`
    connection.query(query1, (err, res) => {
      if (err) throw err;
      inquirer.prompt([{
        type: "list",
        name: "deptId",
        message: "Please select a department to remove",
        choices: res.map(departments => {
          return { name: `${departments.name}`, value: departments.id }
        })
      }])
        .then(answer => {
          let query2 = `DELETE FROM department WHERE ?`
          connection.query(query2, [{ id: answer.deptId }], (err) => {
            if (err) throw err;
            console.log("Department removed")
            runTracker();
          })
        })
    })
  };


//TO REMOVE EMPLOYEE
const removeEmployee = () => {
    let query1 = `SELECT * FROM employee`
    connection.query(query1, (err, res) => {
    if (err) throw err;
    inquirer.prompt([{
      type: "list",
      name: "emId",
      message: "Please select employee to remove",
      choices: res.map(employee => {
        return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
      })
    }])
      .then(answer => {
        let query2 = `DELETE FROM employee WHERE ?`
        connection.query(query2, [{ id: answer.emId }], (err) => {
          if (err) throw err;
          console.log("Employee removed");
          runTracker();
        })
      })
  })
};

//TO UPDATE EMPLOYEE ROLE
const updateEmployeeRole = () => {
    let query = ("SELECT * FROM employee");
  
    connection.query(query, (err, response) => {
  
      const employees = response.map(element => {
        return {
          name: `${element.first_name} ${element.last_name}`,
          value: element.id
        }
      });
  
      inquirer.prompt([{
        type: "list",
        name: "employeeId",
        message: "Which employees role do you want to update",
        choices: employees
      }])
        .then(input1 => {
          connection.query("SELECT * FROM role", (err, data) => {
  
            const roles = data.map(role => {
              return {
                name: role.title,
                value: role.id
              }
            });
  
            inquirer.prompt([{
              type: "list",
              name: "roleId",
              message: "What's the new role",
              choices: roles
            }])
              .then(input2 => {
                const query1 = `UPDATE employee
                                SET employee.role_id = ? 
                                WHERE employee.id = ?`
                connection.query(query1, [input2.roleId, input1.employeeId], (err, res) => {
                  var tempPosition;
                  // will return the updated position
                  for (var k = 0; k < roles.length; k++) {
                    if (roles[k].value == input2.roleId) {
                      tempPosition = roles[k].name;
                    }
                  }
                  // will return the employee
                  var tempName;
                  for (var g = 0; g < employees.length; g++) {
                    if (employees[g].value == input1.employeeId) {
                      tempName = employees[g].name;
                    }
                  }
  
                  if (res.changedRows === 1) {
                    console.log(`Successfully updated ${tempName} to position of ${tempPosition}`);
                  } else {
                    console.log(`Error: ${tempName}'s current position is ${tempPosition}`)
                  }
                  // console.log(res.changedRows);
                  runTracker();
                })
              })
          })
        })
    })
  };
  


