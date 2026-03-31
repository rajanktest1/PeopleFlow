# PeopleFlow 🏢

A full-stack **3-tier HCM/Finance web application** for Human Capital Management, financial management, and analytics — built following DevOps practices.

---

## Features

| Page | Description |
|---|---|
| **Admin Dashboard** | KPI cards (headcount, payroll budget, open roles, applicants) + department headcount chart |
| **Employee Directory** | 25 employees with emoji avatars, role, department, status badges, and detail modal |
| **Payroll Management** | Salary table with gross/tax/net, inline "Update Salary" editing, "Run Payroll" action |
| **Talent Management** | Job posting cards with applicant counts + "Add New Job Posting" form |

---

## Architecture

```
┌──────────────────┐      ┌──────────────────┐      ┌───────────────┐
│   React Client   │─────▶│  Node.js/Express │─────▶│   SQLite DB   │
│   (port 3000)    │◀─────│   (port 5000)    │◀─────│ (peopleflow.db)│
└──────────────────┘      └──────────────────┘      └───────────────┘
      Tier 1                    Tier 2                    Tier 3
   Presentation              Application                 Data
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | SQLite via better-sqlite3 |
| Dev Tools | Nodemon (hot-reload), Create React App |

---

## Project Structure

```
pflow/
├── .gitignore
├── README.md
├── server/                         # Backend API (Tier 2)
│   ├── server.js                   # Express server + all REST routes
│   ├── database.js                 # SQLite connection helper
│   ├── package.json
│   └── db/
│       ├── schema.sql              # DDL – 4 tables
│       ├── seed.js                 # Sample data (25 employees)
│       └── peopleflow.db           # SQLite database (gitignored)
└── client/                         # React frontend (Tier 1)
    ├── package.json
    ├── public/
    └── src/
        ├── App.js                  # Router + sidebar navigation
        ├── App.css                 # Full application theme
        ├── services/
        │   └── api.js              # Axios API client
        └── pages/
            ├── Dashboard.js        # Admin KPI dashboard
            ├── Employees.js        # Employee directory (HR)
            ├── Payroll.js          # Payroll management (Finance)
            └── Talent.js           # Talent/recruiting management
```

---

## Database Schema

```sql
departments (id, name, budget, manager_id)
employees   (id, first_name, last_name, email, role, department_id, salary, emoji, hire_date, status)
payroll     (id, employee_id, pay_period, gross_pay, tax_deduction, net_pay, status)
job_postings(id, title, department_id, description, applicants, status, posted_date)
```

**Relationships:** `employees.department_id → departments.id` | `payroll.employee_id → employees.id` | `job_postings.department_id → departments.id`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Aggregated KPIs + department headcount |
| `GET` | `/api/employees` | List all employees with department names |
| `GET` | `/api/employees/:id` | Single employee detail |
| `POST` | `/api/employees` | Create a new employee |
| `PUT` | `/api/employees/:id` | Update employee fields |
| `GET` | `/api/payroll` | All payroll records with employee info |
| `PUT` | `/api/payroll/update-salary/:employeeId` | Update salary + recalculate payroll |
| `POST` | `/api/payroll/run` | Run payroll for a new pay period |
| `GET` | `/api/job-postings` | List all job postings |
| `POST` | `/api/job-postings` | Create a new job posting |
| `GET` | `/api/departments` | List all departments |

---

## Getting Started

### Prerequisites

- **Node.js** v18+ and npm

### 1. Clone the repository

```bash
git clone <repo-url>
cd pflow
```

### 2. Start the backend

```bash
cd server
npm install
npm run seed        # Creates and populates the SQLite database
npm start           # Starts API on http://localhost:5000
```

### 3. Start the frontend

```bash
cd client
npm install
npm start           # Starts React on http://localhost:3000
```

### 4. Open in browser

Navigate to **http://localhost:3000** and explore the four pages via the sidebar.

---

## Sample Data

The seed script creates:
- **8 departments** — Engineering, HR, Finance, Marketing, Sales, Operations, Legal, Product
- **25 employees** — Each with unique emoji avatar, role, salary, and hire date
- **25 payroll records** — Monthly gross, 22% tax deduction, and net pay
- **7 job postings** — Open positions with applicant counts

---

## DevOps Lifecycle

| Phase | Status |
|---|---|
| **Plan** | Architecture, schema, and API design documented |
| **Code** | React frontend + Node.js backend + SQLite |
| **Build** | `npm install` + `npm run build` |
| **Test** | Local end-to-end verification |
| **Version Control** | Git + .gitignore for secrets/artifacts |
| **Deploy** | _Next: CI/CD pipeline, containerization_ |

---

## License

This is a sample/demo project for learning DevOps practices.
