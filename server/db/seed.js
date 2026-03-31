const getDb = require('../database');

const db = getDb();

// --- Departments ---
const departments = [
    { name: 'Engineering', budget: 500000 },
    { name: 'Human Resources', budget: 200000 },
    { name: 'Finance', budget: 300000 },
    { name: 'Marketing', budget: 250000 },
    { name: 'Sales', budget: 350000 },
    { name: 'Operations', budget: 180000 },
    { name: 'Legal', budget: 150000 },
    { name: 'Product', budget: 280000 },
];

const insertDept = db.prepare('INSERT OR IGNORE INTO departments (name, budget) VALUES (?, ?)');
for (const d of departments) {
    insertDept.run(d.name, d.budget);
}

// --- 25 Employees with emoji avatars ---
const employees = [
    { first: 'Alice', last: 'Johnson', email: 'alice.johnson@peopleflow.com', role: 'Sr. Software Engineer', dept: 1, salary: 130000, emoji: '👩‍💻', hire: '2022-03-15' },
    { first: 'Bob', last: 'Smith', email: 'bob.smith@peopleflow.com', role: 'Engineering Manager', dept: 1, salary: 155000, emoji: '👨‍💼', hire: '2021-01-10' },
    { first: 'Carol', last: 'Williams', email: 'carol.williams@peopleflow.com', role: 'HR Director', dept: 2, salary: 125000, emoji: '👩‍🏫', hire: '2020-06-20' },
    { first: 'David', last: 'Brown', email: 'david.brown@peopleflow.com', role: 'Recruiter', dept: 2, salary: 72000, emoji: '🧑‍💼', hire: '2023-02-14' },
    { first: 'Eva', last: 'Garcia', email: 'eva.garcia@peopleflow.com', role: 'CFO', dept: 3, salary: 185000, emoji: '👩‍💼', hire: '2019-09-01' },
    { first: 'Frank', last: 'Miller', email: 'frank.miller@peopleflow.com', role: 'Accountant', dept: 3, salary: 82000, emoji: '🧑‍💻', hire: '2022-11-05' },
    { first: 'Grace', last: 'Davis', email: 'grace.davis@peopleflow.com', role: 'Marketing Lead', dept: 4, salary: 110000, emoji: '👩‍🎨', hire: '2021-07-22' },
    { first: 'Henry', last: 'Wilson', email: 'henry.wilson@peopleflow.com', role: 'Content Strategist', dept: 4, salary: 78000, emoji: '📝', hire: '2023-04-01' },
    { first: 'Irene', last: 'Moore', email: 'irene.moore@peopleflow.com', role: 'Sales Director', dept: 5, salary: 140000, emoji: '💼', hire: '2020-03-12' },
    { first: 'Jack', last: 'Taylor', email: 'jack.taylor@peopleflow.com', role: 'Account Executive', dept: 5, salary: 88000, emoji: '🤝', hire: '2022-08-18' },
    { first: 'Karen', last: 'Anderson', email: 'karen.anderson@peopleflow.com', role: 'DevOps Engineer', dept: 1, salary: 125000, emoji: '🛠️', hire: '2021-12-03' },
    { first: 'Leo', last: 'Thomas', email: 'leo.thomas@peopleflow.com', role: 'Frontend Developer', dept: 1, salary: 105000, emoji: '🎨', hire: '2023-01-20' },
    { first: 'Maria', last: 'Jackson', email: 'maria.jackson@peopleflow.com', role: 'Payroll Specialist', dept: 3, salary: 68000, emoji: '💰', hire: '2022-05-09' },
    { first: 'Nathan', last: 'White', email: 'nathan.white@peopleflow.com', role: 'Operations Manager', dept: 6, salary: 115000, emoji: '⚙️', hire: '2020-10-28' },
    { first: 'Olivia', last: 'Harris', email: 'olivia.harris@peopleflow.com', role: 'Legal Counsel', dept: 7, salary: 145000, emoji: '⚖️', hire: '2021-04-15' },
    { first: 'Paul', last: 'Martin', email: 'paul.martin@peopleflow.com', role: 'Product Manager', dept: 8, salary: 135000, emoji: '📊', hire: '2021-08-06' },
    { first: 'Quinn', last: 'Thompson', email: 'quinn.thompson@peopleflow.com', role: 'QA Engineer', dept: 1, salary: 95000, emoji: '🔍', hire: '2022-09-14' },
    { first: 'Rachel', last: 'Martinez', email: 'rachel.martinez@peopleflow.com', role: 'UX Designer', dept: 8, salary: 108000, emoji: '🎭', hire: '2022-02-28' },
    { first: 'Sam', last: 'Robinson', email: 'sam.robinson@peopleflow.com', role: 'Data Analyst', dept: 3, salary: 92000, emoji: '📈', hire: '2023-03-10' },
    { first: 'Tina', last: 'Clark', email: 'tina.clark@peopleflow.com', role: 'HR Generalist', dept: 2, salary: 67000, emoji: '🌟', hire: '2023-06-01' },
    { first: 'Umar', last: 'Lewis', email: 'umar.lewis@peopleflow.com', role: 'Security Engineer', dept: 1, salary: 128000, emoji: '🔒', hire: '2021-11-19' },
    { first: 'Vera', last: 'Lee', email: 'vera.lee@peopleflow.com', role: 'Sales Representative', dept: 5, salary: 72000, emoji: '📞', hire: '2023-07-15' },
    { first: 'Will', last: 'Walker', email: 'will.walker@peopleflow.com', role: 'Backend Developer', dept: 1, salary: 118000, emoji: '🖥️', hire: '2022-04-22' },
    { first: 'Xena', last: 'Hall', email: 'xena.hall@peopleflow.com', role: 'Marketing Analyst', dept: 4, salary: 76000, emoji: '📱', hire: '2023-05-08' },
    { first: 'Yusuf', last: 'Allen', email: 'yusuf.allen@peopleflow.com', role: 'Compliance Officer', dept: 7, salary: 98000, emoji: '📋', hire: '2022-07-30' },
];

const insertEmp = db.prepare(
    'INSERT OR IGNORE INTO employees (first_name, last_name, email, role, department_id, salary, emoji, hire_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
);
for (const e of employees) {
    insertEmp.run(e.first, e.last, e.email, e.role, e.dept, e.salary, e.emoji, e.hire);
}

// --- Payroll records for current month ---
const allEmps = db.prepare('SELECT id, salary FROM employees').all();
const insertPayroll = db.prepare(
    'INSERT INTO payroll (employee_id, pay_period, gross_pay, tax_deduction, net_pay, status) VALUES (?, ?, ?, ?, ?, ?)'
);

// Check if payroll already seeded
const payrollCount = db.prepare('SELECT COUNT(*) as cnt FROM payroll').get().cnt;
if (payrollCount === 0) {
    for (const emp of allEmps) {
        const monthly = Math.round((emp.salary / 12) * 100) / 100;
        const tax = Math.round(monthly * 0.22 * 100) / 100; // 22% tax rate
        const net = Math.round((monthly - tax) * 100) / 100;
        insertPayroll.run(emp.id, '2026-03', monthly, tax, net, 'Processed');
    }
}

// --- Job Postings ---
const jobPostings = [
    { title: 'Senior React Developer', dept: 1, desc: 'Build and maintain React-based frontends for enterprise products.', applicants: 12 },
    { title: 'Cloud Infrastructure Engineer', dept: 1, desc: 'Design and manage AWS/Azure cloud infrastructure.', applicants: 8 },
    { title: 'HR Business Partner', dept: 2, desc: 'Partner with business leaders on people strategy.', applicants: 15 },
    { title: 'Financial Analyst', dept: 3, desc: 'Analyze financial data and prepare reports for leadership.', applicants: 6 },
    { title: 'Digital Marketing Manager', dept: 4, desc: 'Lead digital marketing campaigns and strategy.', applicants: 20 },
    { title: 'Enterprise Sales Rep', dept: 5, desc: 'Drive revenue through enterprise client acquisition.', applicants: 10 },
    { title: 'Product Designer', dept: 8, desc: 'Design user experiences for PeopleFlow products.', applicants: 18 },
];

const postingCount = db.prepare('SELECT COUNT(*) as cnt FROM job_postings').get().cnt;
if (postingCount === 0) {
    const insertJob = db.prepare(
        'INSERT INTO job_postings (title, department_id, description, applicants) VALUES (?, ?, ?, ?)'
    );
    for (const j of jobPostings) {
        insertJob.run(j.title, j.dept, j.desc, j.applicants);
    }
}

console.log('✅ Database seeded successfully!');
console.log(`   ${departments.length} departments`);
console.log(`   ${employees.length} employees`);
console.log(`   ${allEmps.length} payroll records`);
console.log(`   ${jobPostings.length} job postings`);

db.close();
