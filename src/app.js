import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import mainRouter from './routes/index.js';

export const app = express();


app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    
  ],
  credentials: true
}));



app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use(cookieParser());


app.use('/api', mainRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// // Optional: Add security middleware in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(helmet()); // Security headers
//   app.use(compression()); // Compress responses
// }
