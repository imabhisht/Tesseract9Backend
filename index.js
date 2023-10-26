import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import eventRoutes from './routes/events.js';
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { saveEvents } from './controllers/events.js';
const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
app.use(morgan('tiny'));
app.use('/events', eventRoutes);
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // You can decide whether to gracefully terminate the process here
});

// Add global promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', reason);
    // You can decide whether to gracefully terminate the process here
});
app.listen(process.env.PORT||5000, () => {
    console.log(`Server running on port ${process.env.PORT||5000}`);
});

const scheduler = new ToadScheduler();
const stopDate = new Date('2023-12-31'); // Replace with your desired stop date

// Create a task that includes the date check
const task = new AsyncTask('save events', async () => {
  const currentDate = new Date();

  // Check if the current date is before the stop date
  if (currentDate <= stopDate) {
    await saveEvents();
  } else {
    console.log('Task stopped after the stop date.');
    scheduler.stop(); // Stop the scheduler if the condition is met
  }
});
const job=new SimpleIntervalJob({ hours: 4, }, task);
scheduler.addSimpleIntervalJob(job);

