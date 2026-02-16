# Muzaffarnagar SHG Service Exchange Platform

A full-stack MERN application for connecting Self Help Groups (SHGs) with local consumers in Muzaffarnagar district.

## Prerequisites
- Node.js installed
- MongoDB installed and running locally

## How to Run

### 1. Start the Database
Ensure your local MongoDB is running.
```bash
# Verify it's running (in a new terminal)
mongod
# OR just ensure the service is active
```

### 2. Start the Backend Server
Open a terminal and run:
```bash
cd server
npm install  # If not already installed
npm start
```
*The server will run on http://localhost:5000*

### 3. Start the Frontend Client
Open a **new** terminal and run:
```bash
cd client
npm install  # If not already installed
npm run dev
```
*The client will run on http://localhost:5173*

## Features
- **Consumers**: Register, Login, Search Services by Category/Location.
- **SHG Providers**: Register (Pending Admin Approval), Dashboard.
- **Admin**: Approve/Reject SHG Registrations.

## default Login
- **Admin**: You need to create an admin user manually in the DB or register a user and change their role to 'admin' in MongoDB.
