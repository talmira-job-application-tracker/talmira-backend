import { Router } from 'express'
import userAuthCheck from '../middlewares/authCheck.js'
import { deleteAlert, listAlerts, viewUnreadAlerts } from '../controllers/notificationController.js'

const alertRoute = Router()
alertRoute.use(userAuthCheck)
alertRoute.get('/viewallalerts', listAlerts)
alertRoute.delete('/delete/:id', deleteAlert)
alertRoute.get("/unread",  viewUnreadAlerts);

export default alertRoute;