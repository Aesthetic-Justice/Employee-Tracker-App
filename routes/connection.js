const mysql = require(`mysql2`);
const { default: fetch } = require("node-fetch");
require(`dotenv`).config();

const inquirer = require(`inquirer`);
const prompts = require(`./inquiries`);


class QueryManager {
    constructor(app, PORT) {
        this.db = mysql.createConnection(
            {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME
            },
            console.log(`Connected to ${process.env.DB_NAME} database.`)
        );
        this.app = app;

        this.PORT = PORT;

        this.initializeRoutes();

        this.app.listen(PORT)

        this.inquiererMain();
    }

    initializeRoutes() {
        this.app.get(`/api/departments`, async (req, res) => {
            const sql = `SELECT * from department`;
            this.db.query(sql, (err, rows) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                };
                res.json({
                    message: `success`,
                    data: rows
                });
            });
        });
        this.app.get(`/api/roles`, async (req, res) => {
            const sql = `SELECT 
            role.id as role_id,
            role.title,
            department.name AS department,
            role.salary AS salary
            FROM role
            JOIN department ON role.department_id = department.id`;
            this.db.query(sql, (err, rows) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                };
                res.json({
                    message: `success`,
                    data: rows
                });
            });
        });
        this.app.get(`/api/employees`, async (req, res) => {
            const sql = `SELECT
            employee.first_name,
            employee.last_name,
            role.title,
            department.name AS department,
            role.salary,
            manager.first_name AS m_first_name,
            manager.last_name AS m_last_name
            FROM employee
            JOIN role ON employee.role_id = role.id
            JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id`
            this.db.query(sql, (err, rows) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                };
                res.json({
                    message: `success`,
                    data: rows
                });
            });
        });
        this.app.post(`/api/department`, async (req, res) => {
            const sql = `INSERT INTO department (name) VALUES (?)`;
            const params = [req.body.name];
            this.db.query(sql, params, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                };
                res.json({
                    message: `success`,
                    data: req.body
                });
            });
        });
        this.app.post(`/api/role`, async (req, res) => {
            const sql = `INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`;
            const params = [
                req.body.title,
                req.body.salary,
                req.body.department_id
            ];
            this.db.query(sql, params, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                };
                res.json({
                    message: `success`,
                    data: req.body
                });
            });
        });
        this.app.post(`/api/employee`, async (req, res) => {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
            const params = [
                req.body.first_name,
                req.body.last_name,
                req.body.role_id,
                req.body.manager_id
            ];
            this.db.query(sql, params, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                };
                res.json({
                    message: `success`,
                    data: req.body
                });
            });
        });
        this.app.put('/api/employee/:id', async (req, res) => {
            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
            const params = [req.body.role_id, req.params.id];

            this.db.query(sql, params, (err, result) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                } else if (!result.affectedRows) {
                    res.json({
                        message: 'Employee not found'
                    });
                } else {
                    res.json({
                        message: 'success',
                        data: req.body,
                        changes: result.affectedRows
                    });
                }
            });
        });
    };

    viewAllDepartments() {
        fetch(`http://localhost:${this.PORT}/api/departments`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                console.table(data.data);
                return
            });
    }

    viewAllRoles() {
        fetch(`http://localhost:${this.PORT}/api/roles`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                console.table(data.data);
                return
            });
    }

    viewAllEmployees() {
        fetch(`http://localhost:${this.PORT}/api/employees`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                console.table(data.data);
                return
            });
    }

    addDepartment(name) {
        fetch(`http://localhost:${this.PORT}/api/department`, {
            method: `POST`,
            body: JSON.stringify({ name }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                console.table(data.data);
                return
            })
    }

    addRole(title, salary, department_id) {
        fetch(`http://localhost:${this.PORT}/api/department`, {
            method: `POST`,
            body: JSON.stringify({ title, salary, department_id }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                console.table(data.data);
                return
            })
    }

    addEmployee(first_name,last_name,role_id,manager_id) {
        fetch(`http://localhost:${this.PORT}/api/employee`, {
            method: `POST`,
            body: JSON.stringify({ first_name,last_name,role_id,manager_id }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                console.table(data.data);
                return
            })
    }

    updateEmployee(employee_id,role_id) {
        fetch(`http://localhost:${this.PORT}/api/employee/${employee_id}`, {
            method: `PUT`,
            body: JSON.stringify({ role_id }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                console.table(data.data);
                return
            })
    }

    inquiererMain() {
        inquirer
            .prompt(prompts.qAllOptions)
            .then((result) => {
                switch (result.taskChoice) {
                    case `view all departments`:
                        this.viewAllDepartments();
                        setTimeout(() => {
                            this.inquiererMain();
                        }, 500);
                        break;
                    case `view all roles`:
                        this.viewAllRoles();
                        setTimeout(() => {
                            this.inquiererMain();
                        }, 500);
                        break;
                    case `view all employees`:
                        this.viewAllEmployees();
                        setTimeout(() => {
                            this.inquiererMain();
                        }, 500);
                        break;
                    case `add a department`:
                        this.inquiererGetQuestion(result.taskChoice);
                        break;
                    case `add a role`:
                        this.inquiererGetQuestion(result.taskChoice);
                        break;
                    case `add an employee`:
                        this.inquiererGetQuestion(result.taskChoice);
                        break;
                    case `update an employee role`:
                        this.inquiererGetQuestion(result.taskChoice);
                        break;
                    case 'quit':
                        process.exit(0);
                    default:
                        console.log(`Error 404: qAllOptions failed to find result`)
                        break;
                }
            });
    };

    inquiererGetQuestion(prompt) {
        let question;
        switch (prompt) {
            case `add a department`:
                question = prompts.qAddDepartment;
                this.inquiererAnswerQuestion(question, prompt);
                break;
            case `add a role`:
                question = prompts.qAddRole;
                fetch(`http://localhost:${this.PORT}/api/departments`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(response => response.json())
                    .then(data => {
                        for (const iterator of data.data) {
                            question[2].choices.push(iterator.name);
                        }
                        this.inquiererAnswerQuestion(question, prompt);
                    });
                break;
            case `add an employee`:
                //question =
                question = prompts.qAddEmployee;
                Promise.all([fetch(`http://localhost:${this.PORT}/api/roles`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }), fetch(`http://localhost:${this.PORT}/api/employees`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })]).then(response => {
                    Promise.all([response[0].json(), response[1].json()])
                        .then(data => {
                            for (const iterator of data[0].data) {
                                question[2].choices.push(iterator.title);
                            }
                            for (const iterator of data[1].data) {
                                question[3].choices.push(iterator.first_name + ` ` + iterator.last_name);
                            }
                            this.inquiererAnswerQuestion(question, prompt)
                        });
                });
                break;
            case `update an employee role`:
                question = prompts.qUpdateEmployee;
                Promise.all([fetch(`http://localhost:${this.PORT}/api/roles`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }), fetch(`http://localhost:${this.PORT}/api/employees`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })]).then(response => {
                    Promise.all([response[0].json(), response[1].json()])
                        .then(data => {
                            //Roles fetch
                            for (const iterator of data[0].data) {
                                question[1].choices.push(iterator.title);
                            }
                            //Employees fetch
                            for (const iterator of data[1].data) {
                                question[0].choices.push(iterator.first_name + ` ` + iterator.last_name);
                            }
                            this.inquiererAnswerQuestion(question, prompt)
                        });
                });
                break; 
            default:
                console.log(`Error 404: Question prompt not found`)
                break;
        }
    }

    inquiererAnswerQuestion(question, switchCase) {
        inquirer
            .prompt(question)
            .then((result) => {
                switch (switchCase) {
                    case `add a department`:
                        this.addDepartment(result.name);
                        setTimeout(() => {
                            this.inquiererMain();
                        }, 500);
                        break;
                    case `add a role`:
                        result.department_id = JSON.stringify(question[2].choices.indexOf(result.department_id) + 1)
                        this.addRole(result.title,result.salary.result.department_id);
                        setTimeout(() => {
                            this.inquiererMain();
                        }, 500);
                        break;
                    case `add an employee`:
                        result.role_id = JSON.stringify(question[2].choices.indexOf(result.role_id) + 1);
                        result.manager_id !== '' ? result.manager_id = JSON.stringify(question[3].choices.indexOf(result.manager_id) + 1) : result.manager_id=NULL;
                        this.addEmployee(result.first_name,result.last_name,result.role_id,result.manager_id);
                        setTimeout(() => {
                            this.inquiererMain();
                        }, 500);
                        break;
                    case `update an employee role`:
                        result.employee_id = JSON.stringify(question[0].choices.indexOf(result.employee_id) + 1);
                        result.role_id = JSON.stringify(question[1].choices.indexOf(result.role_id) + 1);
                        this.updateEmployee(result.employee_id,result.role_id);
                        setTimeout(() => {
                            this.inquiererMain();
                        }, 500);
                        break;
                    default:
                        console.log(`Error 404: Question prompt not found`)
                        break;
                }
            })
    }
}

module.exports = { QueryManager };