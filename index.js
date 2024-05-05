const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

const userRouter = require('./routes/userRouter');

app.use(express.json());
app.use(cors());


app.use('/user', userRouter);

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected!`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }

  connectDB();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});