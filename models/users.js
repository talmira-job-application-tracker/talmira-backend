import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    role: {
        type: String,
        enum:["admin","user"],
        default: "user"
    },
    image:{
        type: String,
        default: null,
    },
    age: {
        type: Number,
        min: 0,
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    skills: {
        type: [String],
        default: [],
    },
    interests: {
        type: [String],
        default: [],
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
    receiveNotification: {
        type: Boolean,
        default:true
    },
},
    {
    timestamps: true
    }
);

const User = mongoose.model('User',userSchema);

export default User;