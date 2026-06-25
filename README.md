# Notification System

## Overview

This project is a full-stack notification management system developed as a practice project. It demonstrates the design and implementation of a scalable notification platform with a focus on clean architecture, maintainability, and production-oriented development practices.

The application supports viewing notifications, prioritizing important notifications, filtering by notification type, pagination, and real-time notification concepts.

---

## Features

* Notification listing
* Priority notifications
* Filter by notification type
* Pagination support
* Read and unread notification status
* Reusable logging middleware
* RESTful API design
* Production-style project structure
* Error handling and validation

---

## Technology Stack

### Frontend

* React
* TypeScript
* Material UI

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* Relational Database (SQL)

---

## Project Structure

```text
project-root/
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── notification-app-fe/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── notification_system_design.md
└── README.md
```

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd notification-app-fe
npm install
npm start
```

---

## Backend

The backend provides REST APIs for notification management and integrates reusable logging middleware for application events and error handling.

---

## Frontend

The frontend provides a responsive interface for:

* Viewing notifications
* Viewing priority notifications
* Filtering notifications
* Pagination
* Read/Unread indication

---

## Logging

A reusable logging utility is integrated throughout the application to capture important application events, warnings, debugging information, and errors.

---

## Project Goals

* Clean architecture
* Modular code
* Scalable APIs
* Maintainable codebase
* Production-ready practices

---

## License

This project is intended for educational and practice purposes.
