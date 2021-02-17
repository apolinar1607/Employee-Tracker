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
            'View All Employees By Department',
            'View All Employees By Manager',
            'Add Employee',
            'Remove Employee',
            'Update Employee Role',
            'Update Employee Manager',
            'Exit'
        ]
    })
    .then((answer) => {
        switch (answer.action){
            case 'View All Employees': 
                viewAll();
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
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Update Employee Manager':
                updateEmployeeManager();
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



