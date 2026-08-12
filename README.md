# NEUZEN AI - Human Resource Management System (HRMS) Platform

Enterprise-grade, full-stack Human Resource Management System (HRMS) built for **NEUZEN AI** with Node.js/Express, React.js, JWT Role-Based Access Control (RBAC), and MongoDB Mongoose ODM.

---

## 🎨 Theme & Palette
The platform adheres strictly to the NEUZEN AI design palette:
- **Primary Deep Teal:** `#659287`
- **Mint Sage Accent:** `#88BDA4`
- **Soft Meadow Mint:** `#B1D3B9`
- **Ice Tint Surface Background:** `#E6F2DD`

---

## 🔐 Pre-configured Demo Accounts

For immediate evaluation, the database comes pre-seeded with the exact requested role accounts:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@neuzenai.com` | `Admin@123` | Full System Access (All Modules, Staff Deletion, Reports, System Config) |
| **HR Lead** | `hr@neuzenai.com` | `Hr@123` | Candidate Onboarding, Offer Letter Generator, Leave Review, Payroll |
| **Employee** | `employee@neuzenai.com` | `Employee@123` | Clock In/Out, Leave Applications, Payslip View/Download, Profile |

---

## 🚀 Key Modules Included

1. **Authentication & RBAC:** JWT authentication, protected routes, single-click role switchers.
2. **Role Dashboards:** Customized executive analytics for Admin, HR, and Employee.
3. **Employee Management:** Full CRUD operations, filtering by department, search, CSV export.
4. **Department Management:** Organizational units, manager assignments, headcount tracking.
5. **Employee Onboarding:** Candidate selection workflow, offer letter generation, PDF download.
6. **Attendance Tracking:** Real-time clock in/out, shift working hours calculation, status logs.
7. **Leave Management:** Leave application, HR review (approve/reject), available leave balances.
8. **Payroll & Payslips:** Salary structure breakdown (Basic, HRA, Medical, PF, Tax) and downloadable PDF payslips.
9. **Company Calendar:** Monthly and weekly views for company holidays, birthdays, and sprint meetings.
10. **System Reports & Analytics:** Executive metrics, headcount velocity, attendance trends, and exportable reports.

---

## 🛠️ Technology Stack

- **Frontend:** React.js, Custom CSS3 Design System, React Router DOM, Axios, Lucide Icons, jsPDF.
- **Backend:** Node.js, Express.js, Mongoose (MongoDB ODM), JWT, BcryptJS, CORS, Dotenv.
- **Database:** MongoDB Atlas / Local MongoDB (with built-in high-res memory engine fallback).

---

## ⚡ Quick Start Guide

### 1. Backend Setup & Startup
```bash
cd backend
npm install
npm run dev
```
*Backend API Server starts on `http://localhost:5000`*

### 2. Frontend Setup & Startup
```bash
cd frontend
npm install
npm run dev
```
*Frontend Web Application opens on `http://localhost:3000`*
