const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Maranatha269872',
    database: 'tracker_db'
});

connection.connect(err => {
    if (err) throw err;
    runTracker();
});

const runTracker = () => {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'Add entry',
            'View Entry',
            'Update Entry',
            'Exit'
        ]
    })
    .then((answer) => {
        switch (answer.action){
            case 'Add entry':
                addEntry();
                break;
            case 'View Entry':
                viewEntry();
                break;
            case 'Update Entry':
                updateEntry();
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

const addEntry = () => {
    inquirer
        .prompt({
            name: 'addEmployee',
            type: 'list',
            message: 'What would you like to add?',
            choices: ''
        })
}