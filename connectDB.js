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
            case 'Update Employee Role':
                updateEmployee();
            case 'Update Employee Manager':
            case 'Exit':
                connection.end();
                break;
            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    });
 
};
 //
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
        inquiry.propmt({
            name: 'managerSelect',
            
        })
    })

}


