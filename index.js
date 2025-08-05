import express from 'express'
import cors from 'cors'
import dotenv, { config } from 'dotenv'
import connectDB from './database/connectDB.js'
import authRouter from './routes/authRoute.js'
import userRouter from './routes/userRoutes.js'
import jobRouter from './routes/jobRoute.js'
import companyRouter from './routes/companyRoute.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000;

connectDB()

//middlewares
app.use('/uploads', express.static('uploads'))
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api/user',userRouter)
app.use('/api/job', jobRouter)
app.use('/api/company', companyRouter)


// Custom error handler
app.use((error, req, res, next) => {
  res.status(error.code || 500).json({
    message: error.message || "An unknown error occurred!",
    status: false
  });
});

// starting server
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})
