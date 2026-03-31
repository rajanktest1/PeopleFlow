-- PeopleFlow Database Schema

CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    budget REAL DEFAULT 0,
    manager_id INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    department_id INTEGER NOT NULL,
    salary REAL NOT NULL,
    emoji TEXT DEFAULT '👤',
    hire_date TEXT NOT NULL,
    status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'On Leave', 'Terminated')),
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS payroll (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    pay_period TEXT NOT NULL,
    gross_pay REAL NOT NULL,
    tax_deduction REAL NOT NULL,
    net_pay REAL NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Processed', 'Paid')),
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS job_postings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    department_id INTEGER NOT NULL,
    description TEXT,
    applicants INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Open' CHECK(status IN ('Open', 'Closed', 'On Hold')),
    posted_date TEXT DEFAULT (date('now')),
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
