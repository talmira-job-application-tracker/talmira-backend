import express from 'express'
import { viewProfile } from '../controllers/userController.js'
import check from 'express-validator'
import userAuthCheck from '../middlewares/authCheck.js'
 
const userRoutes = express.Router()

userRoutes.use(userAuthCheck)

userRoutes.get('/viewprofile',viewProfile)

 export default userRoutes