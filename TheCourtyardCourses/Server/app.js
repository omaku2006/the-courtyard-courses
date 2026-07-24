import express from 'express';
import { connect } from './config/db.js';
import userRouter from './routes/user.router.js';
import courseRouter from './routes/course.router.js';
import communityRouter from './routes/community.router.js';

const app = express();

app.use(express.json());
connect();

app.use('/api', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/community', communityRouter);

app.listen(3000, () => {
  console.log('Server Running : http://localhost:3000/');
});
