# RideX - Ride Booking API

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-blue?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-green?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen?logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)

A secure, scalable, and role-based backend API for a ride-booking system (like Uber or Pathao). This project provides a robust foundation for a ride-sharing application, featuring distinct functionalities for riders, drivers, and administrators.

## 🌐 [Live Deployment Link](https://ridex-api.vercel.app/)
## 🎬 [Video Explanation Link](https://drive.google.com/file/d/1eKFG2txmlB_AWgfoW1DbEcc45jrR_mkQ/view?usp=sharing)

---

## 🚀 Key Features

-   **Authentication & Security**: Secure user registration and login using JWT (JSON Web Tokens) and `bcrypt` for password hashing.
-   **Role-Based Access Control (RBAC)**: A middleware-protected system with three distinct user roles:
    -   👤 **Rider**: Can request, manage, and view their ride history.
    -   🚗 **Driver**: Can accept ride requests, update ride status, and manage their availability.
    -   👮 **Admin**: Can manage the entire system, including users, drivers, and system-wide settings.
-   **Complete Ride Lifecycle Management**: From request to completion, every stage of the ride is tracked, including status updates and history logs.
-   **Modular Architecture**: The codebase is organized into modules for scalability and easy maintenance.
-   **Comprehensive Validation**: Business logic and validations are in place to handle various scenarios like suspended drivers, ride cancellations, and user blocking.

---

## 🛠️ Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Language**: TypeScript
-   **Authentication**: JSON Web Tokens (JWT), bcrypt
-   **Environment Management**: Dotenv
-   **Linting**: ESLint

---

## ⚙️ Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [MongoDB](https://www.mongodb.com/try/download/community) (local instance or a cloud-based solution like MongoDB Atlas)
-   A package manager like `npm` or `yarn`.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/maksudulhaque2000/Assignment-5-L2](https://github.com/maksudulhaque2000/Assignment-5-L2)
    cd ridex-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables. Replace the placeholder values with your actual configuration.

    ```env
    # Server Configuration
    PORT=5000

    # Database URL
    DATABASE_URL=your_mongodb_connection_string

    # JWT Configuration
    JWT_SECRET=your_super_strong_jwt_secret_key
    BCRYPT_SALT_ROUNDS=12
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server should now be running on `http://localhost:5000`.

---

## Endpoints API Documentation

Here is a summary of the available API endpoints.

| Endpoint | Method | Description | Required Role | Sample Body |
| :--- | :--- | :--- | :--- |:--- |
| **Authentication** | | | | |
| `/api/auth/register` | `POST` | Register a new user (rider, driver, or admin). | Public | `{ "name": "...", "email": "...", "password": "...", "role": "rider" }` |
| `/api/auth/login` | `POST` | Log in a user and receive a JWT. | Public | `{ "email": "...", "password": "..." }` |
| | | | | |
| **Rider** | | | | |
| `/api/rides/request` | `POST` | A rider requests a new ride. | `rider` | `{ "pickupLocation": { "coordinates": [...] }, "destinationLocation": { "coordinates": [...] } }` |
| `/api/rides/:id/cancel` | `PATCH` | A rider cancels a requested ride. | `rider` | |
| `/api/rides/history/rider`| `GET` | Get the ride history for the logged-in rider. | `rider` | |
| | | | | |
| **Driver** | | | | |
| `/api/drivers/availability`| `PATCH` | Set the driver's availability status. | `driver` | `{ "availability": "online" }` or `{ "availability": "offline" }` |
| `/api/rides/requests` | `GET` | Get a list of all pending ride requests. | `driver` | |
| `/api/rides/:id/accept` | `PATCH` | A driver accepts a ride request. | `driver` | |
| `/api/rides/:id/status` | `PATCH` | A driver updates the status of a ride. | `driver` | `{ "status": "picked_up" }` or `{ "status": "completed" }` |
| | | | | |
| **Admin** | | | | |
| `/api/admin/users` | `GET` | Get a list of all users. | `admin` | |
| `/api/admin/drivers/:id/approval`| `PATCH` | Approve or suspend a driver. | `admin` | `{ "status": "approved" }` or `{ "status": "suspended" }` |
| `/api/admin/users/:id/block` | `PATCH` | Block or unblock a user account. | `admin` | `{ "isBlocked": true }` or `{ "isBlocked": false }` |

---

## 📂 Project Structure

The project follows a modular architecture to keep the code organized and scalable.

```
src/
├── app.ts                # Express app configuration & middlewares
├── server.ts             # Server initialization & DB connection
├── config/               # Environment variables configuration
├── middlewares/          # Custom middlewares (e.g., authMiddleware)
├── modules/              # Core business logic separated by features
│   ├── auth/
│   ├── user/
│   ├── driver/
│   ├── ride/
│   └── admin/
└── utils/                # Utility functions
```

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.