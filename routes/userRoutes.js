import express from 'express'
import { viewProfile } from '../controllers/userController'
import check from 'express-validator'
 
const userRoutes = express.Router()
 userRoutes.get('/viewprofile',viewProfile)

 export default userRoutes