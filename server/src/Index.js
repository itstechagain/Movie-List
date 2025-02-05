import dotenv from 'dotenv';
import app from './App.js';
import connectDB from './config/db.js';

dotenv.config();
const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});