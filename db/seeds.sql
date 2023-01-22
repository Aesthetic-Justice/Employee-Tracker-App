use employee_tracker_db;

INSERT INTO department (name)
VALUES  ( 'ATF'),
        ('ORK'),
        ('ONI');

INSERT INTO role (title, salary, department_id)
VALUES  ('Intern', '0', 001),
        ('Wrangler', '1000', 001),
        ('Boy', '10', 002),
        ('Boss', '1000', 002),
        ('Private', '5',003),
        ('Master Chief', '10000', 003);
        
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Walter', 'White', 002, NULL),
        ('Jesse', 'Pinkman', 001, 001),
        ('DJ', 'Spitz', 001, 001),
        ('WeirdBoss', 'Arryman', 004, NULL),
        ('Zograttle', 'Goldtoof', 003, 004),
        ('Skrib', 'BigShoota', 003, 004),
        ('John', 'Halo', 006,NULL),
        ('Sly', 'Marbo', 005, 007),
        ('Chips', 'Dubbo', 005, 007);        