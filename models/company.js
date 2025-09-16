import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    industry: {
        type: String,
        enum: ["Software Development",
        "Artificial Intelligence / Machine Learning",
        "Cybersecurity",
        "Cloud Computing",
        "Data Science / Analytics",
        "Marketing & Advertising",
        "Human Resources",
        "Finance & Accounting",
        "Sales",
        "Graphic Design",
        "Content Creation",
        "Animation",
        "UX/UI Design",
        "Mechanical Engineering",
        "Civil Engineering",
        "Electronics & Hardware",
        "Pharmaceuticals",
        "Hospitals & Healthcare Services",
        "Research & Development",
        "Educational Institutes",
        "other",
    ],
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        required: true
    },
    website: {
        type: String,
        default: ''
    },
    logo: {
        type: String,
        default: ''
    },
    isDeleted: {
    type: Boolean,
    default: false
}
});

const Company = mongoose.model('Company', companySchema);
export default Company;

