import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import mainRouter from './routes/index.js';

export const app = express();


// app.use(cors({
//   origin: [
//     "http://localhost:3000",
//     "http://localhost:3001",
//     "https://shotdeck.vercel.app",
//     "http://localhost:5173",
//     "https://marhaba-psi.vercel.app",
//     "http://192.168.250.3:3000"
    
    
//   ],
//   credentials: true
// }));
app.use(cors({
  origin: "*"
}));


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use(cookieParser());


app.use('/api', mainRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// app.listen(3000, '0.0.0.0', () => {
//   console.log('Server running on port 3000');
// });

// // Optional: Add security middleware in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(helmet()); // Security headers
//   app.use(compression()); // Compress responses
// }
