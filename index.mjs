import express from 'express';
// import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './src/routes/authRoutes.mjs';
import roleRouter from './src/routes/roleRoutes.mjs';
import departmentRouter from './src/routes/departmentRoutes.mjs';
import employeeRouter from './src/routes/employeeRoutes.mjs';

const app = express();
// app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'API is healthy' });
});

app.use('/api/auth', authRouter);
app.use('/api/roles', roleRouter);
app.use('/api/departments', departmentRouter);
app.use('/api/employees', employeeRouter);

export default app;
