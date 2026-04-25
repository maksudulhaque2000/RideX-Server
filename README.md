# RideX Server

<p align="center">
  <a href="https://ridex-server-seven.vercel.app/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Live%20API-Visit%20Server-0F172A?style=for-the-badge&logo=vercel&logoColor=white" alt="Live API" />
  </a>
  <a href="https://github.com/maksudulhaque2000/RideX-Server" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Source%20Code-GitHub-111827?style=for-the-badge&logo=github&logoColor=white" alt="Source Code" />
  </a>
</p>

<p align="center">
  A professional ride-hailing backend built with <strong>TypeScript</strong>, <strong>Express</strong>, and <strong>MongoDB</strong>.
  It powers authentication, rider and driver workflows, ride management, and admin operations for the RideX platform.
</p>

---

## Overview

RideX Server is a REST API designed for a ride-sharing application. It provides a role-based backend for three user types:

- Riders who register, request rides, manage their profile, and review ride history.
- Drivers who manage availability, handle ride requests, track earnings, and update ride status.
- Admins who oversee users, drivers, rides, approvals, role management, blocking, and dashboard analytics.

The API is organized into feature modules and uses JWT-based authentication with role authorization middleware.

## Key Features

- JWT authentication with protected routes
- Role-based access control for `rider`, `driver`, and `admin`
- User registration and login
- Driver profile creation during driver registration
- Ride request, cancellation, acceptance, rejection, and status updates
- Rider and driver ride history with pagination and filters
- Driver availability management
- Driver earnings and earnings analytics
- Admin dashboard analytics
- Admin control over users, drivers, roles, and account blocking
- MongoDB data modeling with Mongoose schemas and hooks
- Centralized error handling and CORS configuration

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Token (JWT)
- **Password Hashing:** bcrypt
- **Environment Management:** dotenv
- **CORS:** cors

## Project Structure

```bash
src/
  app.ts                 # Express app setup, middleware, routes, error handling
  server.ts              # Database connection and application bootstrap
  config/
    index.ts             # Environment variable loader and shared config
  middlewares/
    authMiddleware.ts    # JWT auth and role-based access control
  modules/
    auth/                # Register, login, profile endpoints
    user/                # Profile update logic and user model
    driver/              # Driver availability, earnings, analytics, profile
    ride/                # Ride lifecycle, history, and active ride handling
    admin/               # Admin dashboards, moderation, and analytics
```

## Architecture Notes

The server is organized around feature modules rather than a single monolithic controller layer.

- `app.ts` wires global middleware and registers route groups.
- `server.ts` connects to MongoDB and starts the app in non-production environments.
- `authMiddleware.ts` validates the bearer token and enforces allowed roles.
- Each feature module is split into controller, service, route, and model files where needed.
- Mongoose pre-save hooks are used to hash user passwords automatically.

## Authentication Flow

### Registration

When a user registers:

- A `User` document is created.
- If the role is `driver`, a related `Driver` document is also created.
- A JWT token is returned with the user payload.

### Login

When a user logs in:

- The email and password are validated.
- Blocked users are prevented from logging in.
- A JWT token is returned along with the public user profile.

### Protected Routes

Protected routes require:

- `Authorization: Bearer <token>`
- A valid role for the requested action

## Roles and Permissions

### Rider

- Request a ride
- Cancel an active ride
- View ride history
- View current active ride
- Update personal profile

### Driver

- Go online or offline
- View pending ride requests
- Accept, reject, and update ride status
- View active ride
- View ride history
- View earnings and earnings analytics
- Update personal profile

### Admin

- View all users, drivers, and rides
- View dashboard analytics
- Approve or suspend drivers
- Block or unblock users
- Change user roles

## API Overview

Base route prefix:

- `/api/auth`
- `/api/users`
- `/api/drivers`
- `/api/rides`
- `/api/admin`

### Authentication Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get the authenticated user profile

### User Routes

- `PATCH /api/users/me` - Update the authenticated user's profile

### Driver Routes

- `PATCH /api/drivers/availability` - Update driver availability
- `GET /api/drivers/me` - Get the authenticated driver profile
- `GET /api/drivers/me/earnings` - Get driver earnings summary
- `GET /api/drivers/me/earnings-analytics` - Get driver earnings analytics

### Ride Routes

- `POST /api/rides/request` - Request a ride as a rider
- `PATCH /api/rides/:id/cancel` - Cancel a ride
- `GET /api/rides/history/rider` - Get rider ride history
- `GET /api/rides/rider/active-ride` - Get rider active ride
- `GET /api/rides/requests` - Get pending ride requests for drivers
- `PATCH /api/rides/:id/accept` - Accept a ride
- `PATCH /api/rides/:id/reject` - Reject a ride
- `PATCH /api/rides/:id/status` - Update ride status
- `GET /api/rides/driver/active-ride` - Get driver active ride
- `GET /api/rides/history/driver` - Get driver ride history

### Admin Routes

- `GET /api/admin/users` - Get all users
- `GET /api/admin/drivers` - Get all drivers
- `GET /api/admin/rides` - Get all rides
- `GET /api/admin/analytics` - Get dashboard analytics
- `PATCH /api/admin/drivers/:driverId/approval` - Approve or suspend a driver
- `PATCH /api/admin/users/:userId/block` - Block or unblock a user
- `PATCH /api/admin/users/:userId/role` - Update a user's role

## Data Models

### User

Stores the core account profile.

- `name`
- `email`
- `password`
- `role`
- `isBlocked`
- `phone`
- `address`
- `profileImage`

### Driver

Stores driver-specific information.

- `userId`
- `vehicleDetails`
- `licenseNumber`
- `approvalStatus`
- `availability`

### Ride

Stores ride lifecycle and trip state.

- `riderId`
- `driverId`
- `pickupLocation`
- `destinationLocation`
- `status`
- `fare`
- `rideHistory`
- `rejectedBy`

## Environment Variables

Create a `.env` file in the project root with the following values:

```env
PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BCRYPT_SALT_ROUNDS=10
```

## Installation

```bash
git clone https://github.com/maksudulhaque2000/RideX-Server.git
cd RideX-Server
npm install
```

## Running the Project

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Scripts

- `npm run dev` - Start the server in development mode with auto-reload
- `npm run build` - Compile TypeScript into the `dist` directory
- `npm run lint` - Run ESLint across the codebase
- `npm test` - Placeholder script currently set to exit with an error

## Deployment Notes

- The app connects to MongoDB before starting the HTTP server.
- In production, the server is expected to run in a hosted environment such as Vercel or another Node.js platform.
- CORS is configured to allow the approved frontend origins used by the RideX client.

## Links

### Project Links

- [Live API](https://ridex-server-seven.vercel.app/)
- [GitHub Repository](https://github.com/maksudulhaque2000/RideX-Server)
- [Portfolio](https://maksudul-haque.vercel.app/)

### Social Profiles

- [LinkedIn](https://www.linkedin.com/in/maksudulhaque2000/)
- [Facebook](https://www.facebook.com/maksudulhaque2000)
- [YouTube](https://www.youtube.com/@maksudulhaque2000)
- [GitHub](https://github.com/maksudulhaque2000)

## Author

**Maksudul Haque**

- Portfolio: https://maksudul-haque.vercel.app/
- GitHub: https://github.com/maksudulhaque2000
- LinkedIn: https://www.linkedin.com/in/maksudulhaque2000/
