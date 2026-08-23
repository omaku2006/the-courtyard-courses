import express from 'express';
import { connect } from './config/db.js';
import userRouter from './routes/user.router.js';
import courseRouter from './routes/course.router.js';
import communityRouter from './routes/community.router.js';
import postRouter from './routes/post.router.js';
import scheduleRouter from './routes/schedule.router.js';
import analyticsRouter from './routes/analytics.router.js';
import cors from 'cors';

const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://the-courtyard-courses.vercel.app'],
    credentials: true,
  })
);

app.use(express.json());
connect();

app.use('/api', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/community', communityRouter);
app.use('/api', postRouter);
app.use('/api', scheduleRouter);
app.use('/api', analyticsRouter);

// Error handler (keep last)
app.use((err, req, res, next) => {
  console.error('ERROR:', err?.message || err?.name || err);
  res.status(err?.status || 500).json({ message: err?.message || 'Something went wrong!' });
});

app.listen(3000, () => {
  console.log('Server Running : http://localhost:3000/');
});
