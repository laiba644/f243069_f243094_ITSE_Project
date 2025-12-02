# Student Attendance & Result Portal

A comprehensive frontend web application for managing student attendance and academic results in educational institutions. Built with pure HTML, CSS, and Vanilla JavaScript.

## Project Overview

This portal provides a complete solution for:
- **Attendance Management**: Teachers can mark, update, and track student attendance
- **Result Management**: Upload marks with automatic grade calculation
- **Role-Based Access**: Three distinct user roles (Admin, Teacher, Student) with unique dashboards
- **Real-Time Analytics**: Attendance percentages, grade tracking, and performance monitoring

## Features

### User Roles
- **Admin**: Manage users, view system statistics, oversee all operations
- **Teacher**: Mark attendance, upload results, view student progress
- **Student**: View attendance percentage, access marksheet, track grades

### Core Functionality
- Role-based authentication system
- Attendance marking with automatic percentage calculation
- Result upload with weighted grade calculation (Quiz 20%, Assignment 20%, Midterm 25%, Final 35%)
- Automatic grade assignment (A, B, C, D, F)
- Low attendance alerts (below 75% threshold)
- Responsive design for desktop and mobile
- Data persistence using LocalStorage

## Technology Stack

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with CSS Variables, Flexbox, and Grid
- **Vanilla JavaScript** - No frameworks, pure ES6+ JavaScript
- **LocalStorage API** - Client-side data persistence

## Project Structure

```
project/
├── index.html          # Landing page
├── login.html          # Authentication page
├── admin.html          # Admin dashboard
├── teacher.html        # Teacher dashboard
├── student.html        # Student dashboard
├── attendance.html     # Attendance management
├── results.html        # Results upload
├── README.md           # Project documentation
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   ├── auth.js         # Authentication logic
│   ├── storage.js      # LocalStorage operations
│   ├── attendance.js   # Attendance functionality
│   ├── results.js      # Results functionality
│   ├── ui.js           # UI components & helpers
│   └── main.js         # App initialization

```

## Getting Started

### Running Locally
1. Clone or download the repository
2. Open `index.html` in a modern web browser
3. No server setup required - the app runs entirely in the browser

### Demo Credentials
Use any of the following User IDs with password: `password123`

| Role    | User ID   | Name                  |
|---------|-----------|----------------------|
| Admin   | ADMIN001  | System Administrator |
| Teacher | TCH001    | Dr. Sarah Johnson    |
| Teacher | TCH002    | Prof. Michael Chen   |
| Student | STU001    | Ahmed Hassan         |
| Student | STU002    | Maria Garcia         |
| Student | STU003    | John Smith           |


---

**Student Attendance & Result Portal** - Built with HTML, CSS, and Vanilla JavaScript
