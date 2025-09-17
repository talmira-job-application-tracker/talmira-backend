import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    industry: {
        type: String,
        enum: [
        "Technology & IT",
        "Business & Professional",
        "Creative & Media",
        "Industrial & Manufacturing",
        "Marketing & Advertising",
        "Agriculture & Environment",
        "Healthcare & Life Sciences",
        "Electronics & Hardware",
        "Research & Development",
        "Educational Institutes",
        "Food & Beverages",
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

