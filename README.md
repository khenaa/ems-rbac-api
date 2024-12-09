![kenkeputa logo](https://kenkeputa.com/wp-content/uploads/2024/09/Group-1171275090-1.png)

# Employee Management System

## Project Built by: Sampson Ilenikhena

## Project Description:

A backend API for an Employee Management System with Role-Based Access Control (RBAC). This API enables the management of employees, roles, and departments, with access permissions tailored to user roles (Admin, Manager, and Employee).

![MongoDB logo](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvyRmieFYEx56pJ4SVB4N1QWY0-NNBNs1WKw&s)

### Features

    •	MongoDB for data storage.
    •	Secure environment variable management.
    •	Dockerized for easy setup and deployment.
    •	Scalable and portable architecture.

### How to Setup This project

#### Prerequisites

Ensure the following tools are installed:

    1.	Docker
    2.	Docker Compose

![Docker Compose Logo](https://miro.medium.com/v2/resize:fit:1400/1*2G5KOQVzqVIbxxxeKECZkA.jpeg)

1. Clone the Repository

Clone the project to your local machine:

git clone https://github.com/khenaa/ems-rbac-api.git
cd ems-rbac-api

2. Configure Environment Variables

   Create a .env file in the project root and add the following environment variables which will be sent to you over email:

3. Build and Start the Application

Use Docker Compose to build and start the app:

    docker-compose up --build

This command will:

    •	Build the Docker image for the app.
    •	Spin up the application container.
    •	Expose the app on port 9000.

4. Access the Application

Once the app is running, open your browser and go to:

http://localhost:9000

5. Stop and Clean Up

To stop the app and clean up resources:

docker-compose down

### Project Structure

    employee-mgt-system/
    ├── .env                 # I placed this for the Environment variables
    ├── Dockerfile           # Dockerfile for the app
    ├── docker-compose.yml   # Docker Compose configuration
    ├── package.json         # Node.js dependencies and scripts
    ├── server.mjs           # Server entry point
    └── src/                 # Application source code

## API Routes

### Auth Routes

| Endpoint             | HTTP Method | Description                                               |
| -------------------- | ----------- | --------------------------------------------------------- |
| `/api/auth/register` | POST        | Register a new user (Employee & Manager ONLY)             |
| `/api/auth/login`    | POST        | Login a user based on userType (Employee, Manager, Admin) |

### Employee Routes

| Endpoint                 | HTTP Method | Description                |
| ------------------------ | ----------- | -------------------------- |
| `/api/employees`         | GET         | Get all employees          |
| `/api/employees/{id}`    | GET         | Get an employee            |
| `/api/employees`         | POST        | Create a new employee      |
| `/api/employees/{id}`    | PATCH       | Update an employee profile |
| `/api/employees/{id}`    | DELETE      | Delete an employee         |
| `/api/employees/profile` | GET         | Get employee profile       |

### Department Routes

| Endpoint                | HTTP Method | Description               |
| ----------------------- | ----------- | ------------------------- |
| `/api/departments`      | GET         | Get all departments       |
| `/api/departments/{id}` | GET         | Get a specific department |
| `/api/departments`      | POST        | Create a new department   |
| `/api/departments/{id}` | PATCH       | Update a department       |
| `/api/departments/{id}` | DELETE      | Delete a department       |

### Role Routes

| Endpoint          | HTTP Method | Description         |
| ----------------- | ----------- | ------------------- |
| `/api/roles`      | GET         | Get all roles       |
| `/api/roles/{id}` | GET         | Get a specific role |
| `/api/roles`      | POST        | Create a new role   |
| `/api/roles/{id}` | PATCH       | Update a role       |
| `/api/roles/{id}` | DELETE      | Delete a role       |

Full documentation can be found [here]().

### Notes

- Replace `{id}` with the relevant resource ID when using the routes.
- Authentication is required for all routes except `/api/auth/login`.
- Role-Based Access Control (RBAC) governs access to these endpoints based on user roles.

---

## How to Register an Admin User

To create an admin user in the application, follow these steps:

1. Open the **`createAdminScript.js`** file in the project.
2. Replace the placeholder email with the desired admin's email. For example:
   ```javascript
   const email = 'admin@example.com'; // replace with the desired admin email
   ```
3. Run the following command in your terminal to execute the script:

```bash
  npm run create-admin
```
