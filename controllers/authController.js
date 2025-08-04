import { validationResult } from "express-validator"
import HttpError from "../middlewares/httpError";
import bcrypt from 'bcrypt'
import User from "../models/users";
import jwt from "jsonwebtoken";

//register
export const registerUser = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        console.log('validation errors:',errors);

        if(!errors.isEmpty()) {
            return next(new HttpError("Invalid inputs passed, please check again", 422))
        } else {
            const { name, email, role, password } = req.body
            const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : 'uploads/default-profile-pic.png';

            const userExists = await User.findOne({ email });
            if(userExists) {
                return next(new HttpError('User already exists', 400));
            } else {
                const hashedPassword = await bcrypt.hash(password, 12)

                const user = await new User({
                    name,
                    email, 
                    role,
                    password: hashedPassword,
                    image: imagePath,
                    age,
                    phone,
                }).save();

                if(!user){
                    return next(new HttpError('Registration failed', 400));
                } else {
                    const token = jwt.sign(
                        {id: user._id, role: user.role },
                        process.env.JWT_SECRET,
                        { expiresIn: process.env.JWT_TOKEN_EXPIRY}
                    );

                    res.status(201).json({
                        status: true,
                        message: "Registered Successfully",
                        token,
                        data: {
                            _id: user._id,
                            email: user.email,
                            role: user.role,
                            age: user.age
                        }
                    })
                }
            }
        }
    } catch (err) {
        return next(new HttpError("Process failed", 500));
    }
};