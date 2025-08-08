import { Router } from 'express'
import userAuthCheck from '../middlewares/authCheck.js'
import { listAlerts } from '../controllers/notificationController.js'

const alertRoute = Router()
alertRoute.use(userAuthCheck)
alertRoute.get('/viewallalerts', listAlerts)

export default alertRoute;