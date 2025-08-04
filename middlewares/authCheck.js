import jwt from 'jsonwebtoken'
import User from '../models/users.js';
import HttpError from './httpError.js';

const userAuthCheck = async ( req, res, next) => {
    if(req.method === "OPTIONS"){
        return next();
    }

    try{
     const token = req.headers.authorization.split(" ")[1];

     if(!token){
        return next(new HttpError("authentication failed",403));
     }  else {
         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

         const user = await User.findOne({_id: decodedToken.id, role: decodedToken.role })
 
         if(!user){
             return next(new HttpError("invalid credentials",400))
         } else {
             req.userData = {user_id : decodedToken.id, user_role: decodedToken.role};
             next()
         }
     }
    } catch (err) {
        return next(new HttpError("Authentication failed",403));
    }
};

export default userAuthCheck;
