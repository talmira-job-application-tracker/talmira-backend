import { Router } from 'express'
import userAuthCheck from '../middlewares/authCheck.js'
import { deleteAlert, listAlerts, markAlertRead } from '../controllers/notificationController.js'

const alertRoute = Router()
alertRoute.use(userAuthCheck)
alertRoute.get('/viewallalerts', listAlerts)
alertRoute.delete('/delete/:id', deleteAlert)
alertRoute.post('/:id/read', markAlertRead)

export default alertRoute;