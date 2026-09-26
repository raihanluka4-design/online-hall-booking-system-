# Online Hall Booking System 🏛️

**Course:** PBCST304: Object-Oriented Programming (Mini Project)  
**Department:** Artificial Intelligence & Machine Learning (AI & ML)  
**Academic Year:** 2026–27  
**Project Guide:** Mrs. Shana Musthafa APV, Assistant Professor  

**Team Members:**
- MISHAL SHAHIL
- MUHAMMED ZAEEM P.A
- NAJWA A
- SHAMA SHERIFF
- PRANAB B MURALI

---

## 🌟 Project Overview

The **Online Hall Booking System** is a modern institutional web application designed to digitize, accelerate, and streamline campus auditorium and seminar hall reservations. It replaces manual paper registers with an automated, **conflict-free computerized scheduling engine** that strictly prevents double-booking.

---

## 🚀 Key Features

1. **Conflict-Free Scheduling Engine:** Real-time multi-slot verification preventing overlapping reservations.
2. **4 Standard Academic Time Slots:**
   - `09:00 AM – 11:00 AM`
   - `11:00 AM – 01:00 PM`
   - `02:00 PM – 04:00 PM`
   - `04:00 PM – 06:00 PM`
3. **5-Step Guided Booking Wizard:** Hall Selection → Date Picker → Slot & Purpose Details → Summary Review → Instant Pass Generation.
4. **Digital Pass & Printable Receipts:** Official reservation passes with simulated QR verification codes, college department header, and print CSS layout.
5. **Role-Based Portals:**
   - **Public Portal:** Homepage showcase, campus venue browsing, live availability matrix, project viva info.
   - **Student / Staff Portal:** Personal KPI dashboard, Next Upcoming booking spotlight, rescheduling modal, cancellation confirmation, profile manager.
   - **Admin Management Console:** Full CRUD for campus halls, user role elevation/status toggles, booking review modal, Recharts analytics (Area/Line trends, Donut status breakdown, Bar utilization metrics), CSV export.
6. **Design System:** Institutional SaaS UI with Dark & Light mode, responsive mobile navigation drawers, and toast alerts.

---

## 🔑 Demo Credentials

| Role | Email Address | Password | Redirection |
| :--- | :--- | :--- | :--- |
| **Student (User)** | `student@example.com` | `student123` | Student Dashboard (`/user/dashboard`) |
| **Administrator** | `admin@example.com` | `admin123` | Admin Console (`/admin/dashboard`) |

*Convenient 1-Click demo credential fill buttons are provided directly on the Login screen.*

---

## 🏗️ Object-Oriented Architecture (OOP Concepts)

- **Classes & Objects (`src/models/` & `src/types/`):** Encapsulated entities for `User`, `Hall`, `Booking`, and `Report`.
- **Encapsulation (`src/services/`):** Business logic, validation rules, and storage access isolated within `authService`, `hallService`, `bookingService`, `reportService`, and `storageService`.
- **Abstraction (`src/hooks/`):** Custom hooks hide implementation details from UI view layers.
- **Polymorphism & Role Hierarchy:** Role-specific permission gates and dynamic interfaces between Student and Administrator layouts.

---

## 💻 Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons
- **Analytics:** Recharts (AreaChart, PieChart, BarChart)
- **Effects:** Canvas Confetti for celebratory booking confirmation
- **Persistence:** Modular Storage Service layer with local persistence and default dataset seed

---

## 🛠️ How to Run Locally

```bash
# 1. Navigate to project directory
cd hall-booking-system

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```
