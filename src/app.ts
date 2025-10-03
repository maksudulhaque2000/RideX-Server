import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { AuthRoutes } from './modules/auth/auth.route';
import { RideRoutes } from './modules/ride/ride.route';
import { DriverRoutes } from './modules/driver/driver.route';
import { AdminRoutes } from './modules/admin/admin.route';
import { UserRoutes } from './modules/user/user.route';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cors());

const allowedOrigins = [
  'http://localhost:5173',
  'https://ride-x-puce.vercel.app/',
  'https://ride-x-puce.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Application routes
app.use('/api/auth', AuthRoutes);
app.use('/api/rides', RideRoutes);
app.use('/api/drivers', DriverRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/users', UserRoutes);

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to RideX API!');
});

// Not Found Route
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  
  let errorMessage = 'Something went wrong!';
  if (err instanceof Error) {
    errorMessage = err.message;
  }
  
  res.status(500).json({
    success: false,
    message: errorMessage,
  });
});

export default app;