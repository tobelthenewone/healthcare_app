# Healthcare Appointment Management System

A full-stack healthcare appointment management platform built with **Spring Boot**, **Next.js**, **React**, and **TypeScript**. The application allows patients to book appointments, healthcare professionals to manage their schedules and consultations, and administrators to oversee the entire system through role-based dashboards.

---

## Overview

This project demonstrates a production-style architecture with secure authentication, role-based authorization, appointment scheduling, consultation management, and an administrative dashboard.

The application is designed around three user roles:

- **Patient**
- **Healthcare Professional**
- **Administrator**

Each role has its own dashboard, permissions, and workflow.

---

# Features

## Authentication & Security

- JWT Authentication
- Refresh Token Authentication
- Email Verification
- Forgot Password & Password Reset
- Password Change
- Password Hashing using BCrypt
- Token Blacklisting on Logout
- Password Changed Token Invalidation
- Account Lockout after Multiple Failed Login Attempts
- Role-Based Authorization using Spring Security

---

## Patient Features

- Register/Login
- Edit Profile
- Change Password
- Browse Healthcare Professionals
- View Professional Specialties
- View Professional Descriptions
- Book Appointments
- View Available Time Slots
- Cancel Pending Appointments
- View Appointment History
- View Consultation Records
- Dashboard Statistics

---

## Professional Features

- Dashboard
- Manage Weekly Schedule
- Configure Working Hours
- Configure Break Hours
- Enable/Disable Individual Days
- View Assigned Appointments
- Confirm Appointments
- Reject Appointments
- Complete Appointments
- Create Consultation Records
- Edit Existing Consultation Records
- Manage Professional Profile
- Add Professional Description
- Add Medical Specialties

---

## Administrator Features

- Dashboard
- View All Users
- Enable/Disable Users
- Delete Users
- View Appointments
- Filter Appointments
- View Appointment Statuses

---

# Dashboard Statistics

### Patient Dashboard

- Upcoming Appointments
- Completed Appointments
- Consultation Records

### Professional Dashboard

- Today's Appointments
- Pending Appointments
- Completed Appointments

### Administrator Dashboard

- Total Users
- Total Patients
- Total Professionals
- Total Appointments
- Enable/disable users
- View Appointments status
---

# Technologies

## Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- BCrypt
- Java Mail Sender
- Lombok
- Maven

---

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios

---

## Database

- H2 (Development stage)

Can easily be switched to MySQL or PostgreSQL.

---

# Project Architecture

Backend follows a layered architecture:

```
Controller
        ↓
Service
        ↓
Repository
        ↓
Database
```

The project also makes heavy use of DTOs to separate API contracts from database entities.

```
Entity
   ↓
DTO
   ↓
Controller Response
```

---

# Security

The application uses Spring Security with JWT authentication.

Authentication flow:

```
Login
    ↓
Access Token
    ↓
Refresh Token
    ↓
Protected API
    ↓
Token Refresh
```

Security features include:

- JWT Authentication
- Refresh Tokens
- Token Blacklisting
- Password Hashing
- Email Verification
- Password Reset
- Role-Based Access Control

---

# Appointment Workflow

```
Patient
      │
      ▼
Books Appointment
      │
      ▼
Professional
      │
 ┌────┴────┐
 │         │
Confirm  Reject
 │
 ▼
Appointment
 │
 ▼
Complete
 │
 ▼
Consultation Record
```

---

# Scheduling System

Professionals configure:

- Working Days
- Working Hours
- Break Hours

The booking engine automatically:

- Excludes disabled days
- Excludes booked slots
- Excludes break periods
- Returns only available appointment times

---

# API Highlights

Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

Patient

```
GET    /api/patient/dashboard
GET    /api/patient/me
PUT    /api/patient/me
PUT    /api/patient/change-password

GET    /api/patient/professionals

POST   /api/patient/appointments
GET    /api/patient/appointments
PUT    /api/patient/appointments/{id}/cancel

GET    /api/patient/appointments/available-slots
```

Professional

```
GET /api/professional/dashboard

GET /api/professional/schedule
PUT /api/professional/schedule

GET /api/professional/appointments
PUT /api/professional/appointments/{id}/status

GET /api/professional/profile
PUT /api/professional/profile
```

Admin

```
GET /api/admin/dashboard

GET /api/admin/users
GET /api/admin/users/{id}

PUT /api/admin/users/{id}/status

DELETE /api/admin/users/{id}

GET /api/admin/appointments
GET /api/admin/appointments/filter
```

---

# Frontend Highlights

- Responsive Design
- Modern Dashboard UI
- Reusable Components
- Protected Routes
- Role Guards
- Centralized Authentication Context
- Axios Interceptors
- Automatic Token Refresh
- Clean Card-Based Interface

---

# Screenshots
# Admin
<img width="959" height="446" alt="image" src="https://github.com/user-attachments/assets/9adf1914-3e25-450d-af2f-c2f7dd1a499b" />
<img width="959" height="431" alt="image" src="https://github.com/user-attachments/assets/d6732d67-68b7-4dc6-b3a4-3d4d624e363c" />
<img width="959" height="444" alt="image" src="https://github.com/user-attachments/assets/97d528ed-ae8d-4245-8a57-03bc3b0abecb" />
# Professional
<img width="959" height="449" alt="image" src="https://github.com/user-attachments/assets/bae50f8b-5869-4a5c-b96d-241e1ed64d28" />
<img width="1918" height="895" alt="image" src="https://github.com/user-attachments/assets/259057da-5987-4372-991a-eb3de88b8011" />
<img width="959" height="443" alt="image" src="https://github.com/user-attachments/assets/52414eb5-026b-4229-88bf-64b42876c119" />
# Patient
<img width="959" height="449" alt="image" src="https://github.com/user-attachments/assets/bc6d423f-26ce-474c-bf29-34649cde56ff" />
<img width="959" height="458" alt="image" src="https://github.com/user-attachments/assets/8ef15e84-cb0d-4c4f-9e8f-840a7798ba7a" />
# Login and Register
<img width="959" height="446" alt="image" src="https://github.com/user-attachments/assets/861bf8f9-9f92-4da7-a527-c42a0e92bb28" />

- Login
- Register
- Patient Dashboard
- Professional Dashboard
- Admin Dashboard
- Booking Page
- Schedule Management
- Consultation Page
- Profile Pages

---

# Installation

## Backend

```bash
git clone <repository>

cd backend

mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

## Frontend

```bash
cd frontend

pnpm install

pnpm dev
```

Frontend runs on:

```
http://localhost:3000
```

---

# Environment Variables

Backend

```properties
JWT_SECRET=your-secret

MAIL_USERNAME=your-email

MAIL_PASSWORD=your-app-password

SPRING_DATASOURCE_URL=...
```

Frontend

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

---

# Future Improvements

- Notifications
- File Uploads
- Medical Documents
- Video Consultations
- Payment Integration
- Email Appointment Reminders
- Real-Time Updates using WebSockets
- Docker Deployment
- PostgreSQL Production Configuration

---

# Learning Outcomes

This project demonstrates experience with:

- Full-Stack Development
- REST API Design
- Authentication & Authorization
- Spring Security
- Clean Architecture
- DTO Pattern
- Role-Based Access Control
- React & Next.js
- State Management
- API Integration
- Responsive UI Design
- Modern TypeScript Development

---
