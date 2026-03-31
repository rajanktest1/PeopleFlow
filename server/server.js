const express = require('express');
const cors = require('cors');
const getDb = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize DB on startup
const db = getDb();

// ============================================================
// DASHBOARD - Aggregated KPIs
// ============================================================
app.get('/api/dashboard', (req, res) => {
    const totalEmployees = db.prepare('SELECT COUNT(*) as count FROM employees WHERE status = ?').get('Active').count;
    const totalDepartments = db.prepare('SELECT COUNT(*) as count FROM departments').get().count;
    const openPositions = db.prepare("SELECT COUNT(*) as count FROM job_postings WHERE status = ?").get('Open').count;
    const totalApplicants = db.prepare("SELECT COALESCE(SUM(applicants), 0) as count FROM job_postings WHERE status = ?").get('Open').count;

    const payrollData = db.prepare(
        "SELECT COALESCE(SUM(gross_pay), 0) as totalGross, COALESCE(SUM(tax_deduction), 0) as totalTax, COALESCE(SUM(net_pay), 0) as totalNet FROM payroll WHERE pay_period = ?"
    ).get('2026-03');

    const deptHeadcount = db.prepare(`
        SELECT d.name, COUNT(e.id) as headcount
        FROM departments d
        LEFT JOIN employees e ON e.department_id = d.id AND e.status = 'Active'
        GROUP BY d.id
        ORDER BY headcount DESC
    `).all();

    res.json({
        totalEmployees,
        totalDepartments,
        openPositions,
        totalApplicants,
        monthlyPayroll: payrollData,
        departmentHeadcount: deptHeadcount
    });
});

// ============================================================
// EMPLOYEES
// ============================================================
app.get('/api/employees', (req, res) => {
    const employees = db.prepare(`
        SELECT e.*, d.name as department_name
        FROM employees e
        JOIN departments d ON e.department_id = d.id
        ORDER BY e.last_name, e.first_name
    `).all();
    res.json(employees);
});

app.get('/api/employees/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: 'Invalid employee ID' });
    }
    const employee = db.prepare(`
        SELECT e.*, d.name as department_name
        FROM employees e
        JOIN departments d ON e.department_id = d.id
        WHERE e.id = ?
    `).get(id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
});

app.post('/api/employees', (req, res) => {
    const { first_name, last_name, email, role, department_id, salary, emoji, hire_date } = req.body;
    if (!first_name || !last_name || !email || !role || !department_id || !salary || !hire_date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const result = db.prepare(
            'INSERT INTO employees (first_name, last_name, email, role, department_id, salary, emoji, hire_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(first_name, last_name, email, role, department_id, salary, emoji || '👤', hire_date);
        res.status(201).json({ id: result.lastInsertRowid, message: 'Employee created' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/employees/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: 'Invalid employee ID' });
    }
    const { first_name, last_name, email, role, department_id, salary, emoji, status } = req.body;
    try {
        const result = db.prepare(`
            UPDATE employees SET
                first_name = COALESCE(?, first_name),
                last_name = COALESCE(?, last_name),
                email = COALESCE(?, email),
                role = COALESCE(?, role),
                department_id = COALESCE(?, department_id),
                salary = COALESCE(?, salary),
                emoji = COALESCE(?, emoji),
                status = COALESCE(?, status)
            WHERE id = ?
        `).run(first_name, last_name, email, role, department_id, salary, emoji, status, id);
        if (result.changes === 0) return res.status(404).json({ error: 'Employee not found' });
        res.json({ message: 'Employee updated' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ============================================================
// PAYROLL
// ============================================================
app.get('/api/payroll', (req, res) => {
    const payroll = db.prepare(`
        SELECT p.*, e.first_name, e.last_name, e.emoji, e.role, e.salary as annual_salary, d.name as department_name
        FROM payroll p
        JOIN employees e ON p.employee_id = e.id
        JOIN departments d ON e.department_id = d.id
        ORDER BY e.last_name, e.first_name
    `).all();
    res.json(payroll);
});

app.put('/api/payroll/update-salary/:employeeId', (req, res) => {
    const employeeId = Number(req.params.employeeId);
    if (!Number.isInteger(employeeId) || employeeId < 1) {
        return res.status(400).json({ error: 'Invalid employee ID' });
    }
    const { salary } = req.body;
    if (!salary || salary <= 0) {
        return res.status(400).json({ error: 'Valid salary required' });
    }
    try {
        db.prepare('UPDATE employees SET salary = ? WHERE id = ?').run(salary, employeeId);
        // Recalculate current payroll
        const monthly = Math.round((salary / 12) * 100) / 100;
        const tax = Math.round(monthly * 0.22 * 100) / 100;
        const net = Math.round((monthly - tax) * 100) / 100;
        db.prepare('UPDATE payroll SET gross_pay = ?, tax_deduction = ?, net_pay = ? WHERE employee_id = ? AND pay_period = ?')
            .run(monthly, tax, net, employeeId, '2026-03');
        res.json({ message: 'Salary updated', monthly, tax, net });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/payroll/run', (req, res) => {
    const { pay_period } = req.body;
    if (!pay_period) {
        return res.status(400).json({ error: 'pay_period required (YYYY-MM)' });
    }
    const existing = db.prepare('SELECT COUNT(*) as cnt FROM payroll WHERE pay_period = ?').get(pay_period).cnt;
    if (existing > 0) {
        return res.status(400).json({ error: `Payroll already exists for ${pay_period}` });
    }
    const employees = db.prepare("SELECT id, salary FROM employees WHERE status = 'Active'").all();
    const insert = db.prepare('INSERT INTO payroll (employee_id, pay_period, gross_pay, tax_deduction, net_pay, status) VALUES (?, ?, ?, ?, ?, ?)');
    const runAll = db.transaction(() => {
        for (const emp of employees) {
            const monthly = Math.round((emp.salary / 12) * 100) / 100;
            const tax = Math.round(monthly * 0.22 * 100) / 100;
            const net = Math.round((monthly - tax) * 100) / 100;
            insert.run(emp.id, pay_period, monthly, tax, net, 'Processed');
        }
    });
    runAll();
    res.status(201).json({ message: `Payroll run for ${pay_period}`, employeesProcessed: employees.length });
});

// ============================================================
// JOB POSTINGS
// ============================================================
app.get('/api/job-postings', (req, res) => {
    const postings = db.prepare(`
        SELECT jp.*, d.name as department_name
        FROM job_postings jp
        JOIN departments d ON jp.department_id = d.id
        ORDER BY jp.posted_date DESC
    `).all();
    res.json(postings);
});

app.post('/api/job-postings', (req, res) => {
    const { title, department_id, description } = req.body;
    if (!title || !department_id) {
        return res.status(400).json({ error: 'title and department_id required' });
    }
    try {
        const result = db.prepare(
            'INSERT INTO job_postings (title, department_id, description) VALUES (?, ?, ?)'
        ).run(title, department_id, description || '');
        res.status(201).json({ id: result.lastInsertRowid, message: 'Job posting created' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ============================================================
// DEPARTMENTS (supporting endpoint)
// ============================================================
app.get('/api/departments', (req, res) => {
    const departments = db.prepare('SELECT * FROM departments ORDER BY name').all();
    res.json(departments);
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
    console.log(`🚀 PeopleFlow API server running on http://localhost:${PORT}`);
});
