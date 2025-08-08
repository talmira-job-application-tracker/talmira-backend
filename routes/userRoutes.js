import express from 'express'
import { deleteUserProfile, editProfile,  listAllProfile,    toggleReceiveNotification,    viewProfile } from '../controllers/userController.js'
import userAuthCheck from '../middlewares/authCheck.js'
import { uploadLogo } from '../middlewares/upload.js'
 
const userRouter = express.Router()

userRouter.use(userAuthCheck)

userRouter.get('/viewprofile',viewProfile)
userRouter.patch('/editprofile', uploadLogo.single('image'), editProfile)
userRouter.get('/listallusers', listAllProfile)
userRouter.delete('/deleteprofile/:id',deleteUserProfile)
userRouter.patch("/togglenotification",  toggleReceiveNotification);


 export default userRouter