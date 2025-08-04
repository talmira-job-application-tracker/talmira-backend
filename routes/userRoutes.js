import express from 'express'
import { editProfile,  viewProfile } from '../controllers/userController.js'
import check from 'express-validator'
import userAuthCheck from '../middlewares/authCheck.js'
 
const userRoutes = express.Router()

userRoutes.use(userAuthCheck)

userRoutes.get('/viewprofile',viewProfile)
userRoutes.patch('/editprofile', editProfile)


 export default userRoutes