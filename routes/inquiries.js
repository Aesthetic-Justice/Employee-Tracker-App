//THEN I am presented with the following options: 
//view all departments, 
//view all roles, 
//view all employees, 
//add a department, 
//add a role, 
//add an employee, 
//and update an employee role
const inquirer = require(`inquirer`);

const qAllOptions = [
    {
        type: `list`,
        message: `Please choose one of the following`,
        choices: [
            `view all departments`,
            `view all roles`,
            `view all employees`,
            `add a department`,
            `add a role`,
            `add an employee`,
            `update an employee role`,
            `quit`],
        name: `taskChoice`
    }
]

const qAddDepartment = [
    {
        type: `input`,
        message: `Please enter a name`,
        name: `name`
    }
]

const qAddRole = [
    {
        type: `input`,
        message: `Please enter a title`,
        name: `title`
    },
    {
        type: `input`,
        message: `Please enter a salary`,
        name: `salary`
    },
    {
        type: `list`,
        message: `Please choose a department`,
        choices: [],
        name: `department_id`
    }
]

const qAddEmployee = [
    {
        type: `input`,
        message: `Please enter employee first name`,
        name: `first_name`
    },
    {
        type: `input`,
        message: `Please enter employee lase name`,
        name: `last_name`
    },
    {
        type: `list`,
        message: `Please choose a role`,
        choices: [],
        name: `role_id`
    },
    {
        type: `list`,
        message: `Please choose a manager`,
        choices: [],
        name: `manager_id`
    }
]

const qUpdateEmployee = [
    {
        type: `list`,
        message: `Which Employee would you like to update?`,
        choices: [],
        name: `employee_id`
    },
    {
        type: `list`,
        message: `Which Role would you like to assign them?`,
        choices: [],
        name: `role_id`
    }
]

module.exports = { qAllOptions, qAddDepartment, qAddRole, qAddEmployee, qUpdateEmployee};