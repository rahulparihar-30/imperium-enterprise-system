# HR Management System

This is an HR Management System built using Node.js, Express, and MongoDB. It provides various endpoints to manage jobs, applications, employees, and attendance records.

## Features

- Job Management
    - Create, read, update, and delete job postings.
- Application Management
    - Submit job applications.
    - Filter and manage job applications.
- Employee Management
    - Add, update, and delete employee records.
    - Fetch employee details.
- Attendance Management
    - Mark and update attendance records.
    - Filter and manage attendance records.
- Interview Scheduling
    - Schedule interviews for applicants.
    - Update interview schedules.
    - Cancel scheduled interviews.
    - Fetch interview details.
## Prerequisites

- Node.js
- MongoDB
- dotenv

## Installation

1. Clone the repository:
     ```bash
     git clone <repository-url>
     ```
2. Navigate to the project directory:
     ```bash
     cd HR-Management-System
     ```
3. Install the dependencies:
     ```bash
     npm install
     ```
4. Create a `.env` file in the root directory and add your MongoDB URI:
     ```env
     DATABASE_URI=your_mongodb_uri
     ```

## Running the Application

1. Start the server:
     ```bash
     npm start
     ```
2. The server will start on port 3000. You can access the endpoints at `http://localhost:3000`.

## API Endpoints

### Job Management

- **Get all jobs**
    ```http
    GET /hr/jobs
    ```
- **Create a new job**
    ```http
    POST /hr/jobs/new
    ```
- **Get a job by ID**
    ```http
    GET /hr/jobs/:id
    ```
- **Update a job**
    ```http
    PUT /hr/jobs/edit
    ```
- **Delete a job**
    ```http
    DELETE /hr/jobs/delete
    ```

### Application Management

- **Get all applications**
    ```http
    GET /hr/applications
    ```
- **Submit a job application**
    ```http
    POST /hr/apply
    ```
- **Filter applicants**
    ```http
    GET /hr/filter-applicant
    ```
- **Update application status**
    ```http
    PUT /hr/application/status
    ```
- **Delete an application**
    ```http
    DELETE /hr/application/delete
    ```

### Employee Management

- **Add a new employee**
    ```http
    POST /hr/employee/add
    ```
- **Update an employee**
    ```http
    PUT /hr/employee/update
    ```
- **Get all employees**
    ```http
    GET /hr/employees
    ```
- **Get an employee by ID**
    ```http
    GET /hr/employee/:id
    ```
- **Delete an employee**
    ```http
    DELETE /hr/employee/delete
    ```

### Attendance Management

- **Mark attendance**
    ```http
    POST /hr/attendance/mark
    ```
- **Get all attendance records**
    ```http
    GET /hr/attendance
    ```
- **Get attendance by ID**
    ```http
    GET /hr/attendance/:id
    ```
- **Update attendance**
    ```http
    PUT /hr/attendance/update
    ```
- **Filter attendance records**
    ```http
    GET /hr/attendance-filter
    ```
- **Delete attendance record**
    ```http
    DELETE /hr/attendance/delete
    ```

## Error Handling

The application provides appropriate error messages and status codes for various scenarios, such as invalid IDs, missing required fields, and server errors.

## License

This project is licensed under the MIT License.