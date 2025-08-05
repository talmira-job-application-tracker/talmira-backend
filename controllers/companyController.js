import HttpError from "../middlewares/httpError.js";
import Company from "../models/company.js";

//addcompany
export const addCompany = async (req, res, next) => {
  try {
    const { name, industry, description, location, website,logo } = req.body;
    const role = req.userData.user_role;

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can add companies' });
    }

    if (!name || !industry || !location) {
      return next(new HttpError("Required fields missing", 400));
    }

    const newCompany = new Company({
      name,
      industry,
      description,
      location,
      website,
      logo
    });

    await newCompany.save();
    console.log("Saved Company:", newCompany);


    res.status(201).json({
      status: true,
      message: 'Company added successfully',
      data: null
    });

  } catch (err) {
    return next(new HttpError('Failed to add company', 500));
  }
};

//update company
export const editProfile = async (req,res,next) => {
    try{
    const role = req.userData.user_role
     
    } catch {

    }
}
