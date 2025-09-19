import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './database/connectDB.js'
import authRouter from './routes/authRoute.js'
import userRouter from './routes/userRoutes.js'
import jobRouter from './routes/jobRoute.js'
import companyRouter from './routes/companyRoute.js'
import applicationRouter from './routes/applicationRoute.js'
import subscriptionRouter from './routes/subscriptionRoute.js'
import alertRoute from './routes/notificationRoute.js'
import cookieParser from 'cookie-parser'
import dashboardRouter from './routes/dashboardRoute.js'
import interviewRouter from './routes/interviewRoute.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000;

connectDB()

//middlewares
app.use('/uploads', express.static('uploads'))
app.use(express.json())
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_LIVE],
    credentials: true,
  })
);

app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/user',userRouter)
app.use('/api/job', jobRouter)
app.use('/api/company', companyRouter)
app.use('/api/application', applicationRouter)
app.use('/api/subscription', subscriptionRouter)
app.use('/api/alert',alertRoute)
app.use('/api/dashboard',dashboardRouter)
app.use('/api/interview', interviewRouter)

app.use((error, req, res, next) => {
  res.status(error.code || 500).json({
    message: error.message || "An unknown error occurred!",
    status: false
  });
});

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})
