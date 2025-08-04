import express from 'express'
import { editProfile,  viewProfile } from '../controllers/userController.js'
import userAuthCheck from '../middlewares/authCheck.js'
 
const userRouter = express.Router()

userRouter.use(userAuthCheck)

userRouter.get('/viewprofile',viewProfile)
userRouter.patch('/editprofile', editProfile)


 export default userRouter