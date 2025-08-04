import express from 'express'
import cors from 'cors'
import dotenv, { config } from 'dotenv'
import connectDB from './database/connectDB.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000;

connectDB()

//middlewares
app.use('/uploads', express.static('uploads'))
app.use(express.json())
app.use(cors())


// Custom error handler
app.use((error, req, res, next) => {
  res.status(error.code || 500).json({
    message: error.message || "An unknown error occurred!",
    status: false
  });
});

// GLOBAL ERROR HANDLER
app.use((error, res) => {
    const statusCode = typeof error.code === 'number' ? error.code : 500;
    res.status(statusCode).json({
        message: error.message || "An unknown error occurred",
    });
});


// starting server
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})
