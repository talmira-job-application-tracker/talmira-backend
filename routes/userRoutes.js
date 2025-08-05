import express from 'express'
import { deleteUserProfile, editProfile,  listAllProfile,    viewProfile } from '../controllers/userController.js'
import userAuthCheck from '../middlewares/authCheck.js'
 
const userRouter = express.Router()

userRouter.use(userAuthCheck)

userRouter.get('/viewprofile',viewProfile)
userRouter.patch('/editprofile', editProfile)
userRouter.get('/listallusers', listAllProfile)
userRouter.delete('/deleteprofile/:id',deleteUserProfile)


 export default userRouter