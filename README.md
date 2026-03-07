# TechMicra ERP WebApp

TechMicra ERP is a comprehensive, unified Enterprise Resource Planning web application designed to streamline and automate core business workflows. It integrates Production Management, Human Resources, and Financial Operations into one centralized, intuitive platform.

The application leverages a modern tech stack:
- **Backend:** Laravel (PHP) REST API
- **Frontend:** React.js (JavaScript) with modern UI tools
- **Database:** MySQL

---

## 📋 Prerequisites

Before you begin setting up the project locally, please ensure your system has the following installed:

- **PHP** (v8.1 or higher)
- **Composer** (PHP Package Manager)
- **Node.js** (v18.x or higher) and **npm** 
- **MySQL** (v8.0 or higher)

---

## 🛠️ Installation & Execution Instructions

The project is divided into two primary directories: `backend` and `frontend`. You will need to spin up both separately to successfully run the application.

### 1. Database Setup

1. Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin or terminal).
2. Create a new database for the application. You can name it `techmicra_erp` (or any name you prefer).

```sql
CREATE DATABASE techmicra_erp;
```

### 2. Backend Setup (Laravel)

The backend handles the core business logic, database migrations, and serves the REST API.

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the required PHP dependencies using Composer:
   ```bash
   composer install
   ```
3. Copy the example environment file and create your own `.env` file:
   ```bash
   cp .env.example .env
   ```
   *(On Windows Command Prompt, use `copy .env.example .env`)*
4. Open the `.env` file in your code editor and update the database configuration to match your local MySQL setup:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=techmicra_erp
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   ```
5. Generate the application encryption key:
   ```bash
   php artisan key:generate
   ```
6. Run the database migrations and seeders to create the tables and populate basic default data (like roles and default users):
   ```bash
   php artisan migrate --seed
   ```
   *Note: If you have separate seeders, you might specifically run `php artisan db:seed --class=RBACSeeder` to load dashboard credentials.*
7. Start the Laravel development server:
   ```bash
   php artisan serve
   ```
   *The backend API will now be accessible at `http://127.0.0.1:8000`.*

### 3. Frontend Setup (React)

The frontend provides the interactive user interface, connecting to the Laravel backend.

1. Open a new, separate terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the necessary JavaScript dependencies using npm:
   ```bash
   npm install
   ```
3. Set up your environment variables. Copy the example configuration (if `.env.example` exists) or create a `.env` file in the `frontend` directory. Ensure it points to your local backend API. For a typical Vite/React app:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   ```
   *(Check your environment variable naming convention in the frontend codebase if it differs).*
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The terminal will provide a local URL (usually `http://localhost:5173` or `http://localhost:3000`). Open this link in your browser to view the application.*

---

## 🔐 Default Login Credentials

By running the seeders during the backend setup, the system automatically creates default test users based on Role-Based Access Control (RBAC). 

For a complete list of credentials (Sales, HR, Finance, Production, etc.), refer to the included `Dashboard_Credentials.md` file in the root directory.

**Super Admin (All Access):**
- **Email:** `admin@techmicra.com`
- **Password:** `admin123`

---

## 🛑 Troubleshooting / Common Issues

- **CORS Errors:** If your frontend fails to connect to the backend, ensure your backend's `config/cors.php` file allows requests from your frontend's URL (`http://localhost:5173`). Check your `.env` frontend URL setup.
- **Database Connection Error:** Double-check your MySQL credentials in the `backend/.env` file and ensure the MySQL server is actively running.
- **Node Module Errors:** If the frontend fails to build, try removing the `node_modules` folder and `package-lock.json` file inside the `/frontend` directory, and run `npm install` again.

