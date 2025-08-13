import { validationResult } from "express-validator"
import HttpError from "../middlewares/httpError.js";
import bcrypt from 'bcrypt'
import User from "../models/users.js";
import jwt from "jsonwebtoken";

//register
export const registerUser = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        console.log('validation errors:',errors);

        if(!errors.isEmpty()) {
            return next(new HttpError(errors.array()[0].msg, 422));
        } else {

            const { name, email, password, age, phone } = req.body
            const skills = Array.isArray(req.body.skills)
            ? req.body.skills
            : req.body.skills.split(',').map(s => s.trim().toLowerCase());

            const interests = Array.isArray(req.body.interests)
            ? req.body.interests
            : req.body.interests.split(',').map(i => i.trim().toLowerCase());

            const imagePath = req.file ? `/uploads/others/${req.file.filename}` : '/uploads/default-profile-pic.png';

            const userExists = await User.findOne({ email });
            if(userExists) {
                return next(new HttpError('User already exists', 400));
            } else {
                const hashedPassword = await bcrypt.hash(password, 12)


                const user = await new User({
                    name,
                    email, 
                    password: hashedPassword,
                    image: imagePath,
                    age,
                    skills,
                    interests,
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
                            age: user.age,
                            image:user.image
                        }
                    })
                }
            }
        }
    } catch (err) {
        console.error("Register Error:", err);
        return next(new HttpError("Process failed", 500));
    }
};

//login
export const loginUser = async ( req, res, next) => {
    try{
         const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError(errors.array()[0].msg, 422)); 
        }
        const { email, password } = req.body;
        const user = await User.findOne({email});

        if(!user){
            return next(new HttpError("user doesn't exist",404));
        } else {
            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch){
                return next(new HttpError('invalid credentials',403))
            } else {
                const token = jwt.sign(
                    { id: user._id, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_TOKEN_EXPIRY}
                );

                if(!token){
                    return next(new HttpError('Token generation failed', 403));
                } else {
                    res.status(200).json({
                        status: true,
                        message: "Login successful",
                        token,
                        data: {
                            _id: user.id,
                            email: user.email,
                            role: user.role
                        }
                    })
                }
            }
        }
    } catch (err){
        return next(new HttpError("Login Failed", 500));
    }
};