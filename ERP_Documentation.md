# TechMicra ERP - System Architecture & Functionalities

TechMicra ERP is a modern, modular web application engineered to consolidate and automate the core operations of a business. Unifying Production, Human Resources, and Financial accounting under a single platform, it is tailored primarily for SMEs looking to optimize workflow communication and eliminate data silos.

---

## 🛠️ Project Dependencies & Tech Stack

The system is structurally divided into two layers: a RESTful backend API and a dynamic, component-driven frontend SPA (Single Page Application).

### Backend Dependencies (Laravel API)
- **PHP Core (`^8.2`)**: The minimum required version ensuring strict typings and security.
- **Laravel Framework (`^12.0`)**: The core PHP framework governing routing, database MVC interactions, and business logic.
- **Laravel Sanctum (`^4.0`)**: Handles secure API token authentication for users and sessions.
- **Spatie Laravel Permission (`^7.2`)**: A vital dependency that powers the advanced Role-Based Access Control (RBAC) across the various dashboard modules (HR manager, Finance manager, etc.).
- **MySQL Database**: Central relational database holding all interconnected tables.

### Frontend Dependencies (React SPA)
- **React (`^19.2.0`) & React DOM**: The core library for building interactive user interfaces via functional components and hooks.
- **Vite (`^8.0.0-beta`)**: The ultra-fast frontend build tool and development server, replacing traditional tools like Webpack.
- **Material UI (`@mui/material ^7.3.9`) & Emotion**: Provides pre-designed, accessible React components (like DataTables, Modals, Buttons) for a consistent and professional "dashboard" aesthetic.
- **Tailwind CSS (`^4.2`)**: A utility-first CSS framework for rapid and highly customized inline styling, bridging the gap alongside Material UI.
- **Axios (`^1.13`)**: The promised-based HTTP client used to fetch data from and post data to the Laravel backend API.
- **React Router DOM (`^7.13`)**: Handles secure application routing, allowing users to navigate between dashboards seamlessly without page reloads.

---

## 🚀 Core Modules & Functionalities

The ERP is highly comprehensive, covering a broad variety of organizational lifecycles grouped logically by department:

### 1. Security & Administration (RBAC)
- **Role-Based Access**: Specialized manager roles (Super Admin, HR, Finance, Production, Logistics, Quality, Store, Maintenance, Contractor) ensuring users only see data pertinent to their department.
- **Token Authentication**: Secure session handling for logging in and out of the dashboards.

### 2. Human Resources (HR) Module
- **Employee Master Directory**: Centralized management of employee profiles, banking details, and status.
- **Salary Structures**: Customizable mappings of basic salaries and associated allowances/deductions.
- **Payroll (Monthly Salary Sheets)**: Automated generation of monthly salary disbursements.
- **Advance Memos**: Tracking of salary advances and short-term loans taken by employees.
- **Contractor Management**: Independent tracking for third-party contractor employees, their advances, and monthly vendor payouts.

### 3. Finance Module
- **Payment & Receipt Vouchers**: Recording daily cash or bank transactions (money in vs. money out) related to parties.
- **Journal Vouchers**: Standard double-entry accounting adjustments and ledgers.
- **Contra Vouchers**: Specific transactions documenting cash deposits to banks, bank withdrawals, or bank-to-bank transfers.
- **GST Journal Vouchers**: Distinct accounting entries to record Input/Output tax liabilities to remain compliant with regional tax regulations.
- **Bank Reconciliation**: Connecting physical bank statements to internal system records to ensure accounting accuracy.

### 4. Production, Quality & Logistics Module 
*(Depending on active routes)*
- **Procurement & Inventory**: Tracking Purchase Orders (POs), Purchase Schedules, and Goods Receipt Notes (GRN).
- **Quality Control**: Recording Initial Quality Checks (IQC), Process Quality Controls, and Pre-Dispatch Inspections to maintain standardized product output.
- **Shop Floor Management**: Managing Tools, Calibration schedules, Tool Maintenance, and Repair workflows.
- **Logistics & Dispatch**: Generating Delivery Challans, Logistics Bookings, and Freight Billbooks to ensure accurate shipping and delivery tracking.
