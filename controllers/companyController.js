import { validationResult } from "express-validator";
import HttpError from "../middlewares/httpError.js";
import Company from "../models/company.js";

//addcompany
export const addCompany = async (req, res, next) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(errors.array()[0].msg, 422));
    }

    const { name, industry, description, location, website, logo } = req.body;
    
    const role = req.userData.user_role;
    

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can add companies' });
    }

    if (!name || !industry || !location) {
      return next(new HttpError("Required fields missing", 400));
    }

  
    const logoPath = req.file ? `/uploads/logos/${req.file.filename}` : null;
    const newCompany = new Company({
      name,
      industry,
      description,
      location,
      website,
      logo: logoPath
    });

    await newCompany.save();
    console.log("Saved Company:", newCompany);


    res.status(201).json({
      status: true,
      message: 'Company added successfully',
      data: null
    });

  } catch (err) {
     console.error("Add Company Error:", err);
    return next(new HttpError('Failed to add company', 500));
  }
};

//update company
export const editCompanyProfile = async (req,res,next) => {
    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(errors.array()[0].msg, 422));
    }

    const role = req.userData.user_role
    
    if (role !== 'admin') {
      return next (new HttpError("Unauthorized access", 403))
    }
    const companyId = req.params.id;
     
    const { name, industry, description, location, website } = req.body;
    const logoPath = req.file ? `/uploads/logos/${req.file.filename}` : null;
    // console.log("req.body:", req.body);
    // console.log("req.file:", req.file);


    const company = await Company.findById(companyId);
      if (!company) {
        return next(new HttpError("Company not found", 404));
      } else {
        company.name = name || company.name;
        company.industry = industry || company.industry;
        company.description = description || company.description;
        company.location = location || company.location;
        company.website = website || company.website;
        company.logo = logoPath || company.logo;
        
        await company.save()

        res.status(200).json({
          status: true,
          message: "Company profile updated successfully",
          data: company

        })
      }
    } catch (err) {
        console.error(err)
      return next (new HttpError("Something went wrong while updating", 500))
    }
}

//delete company
export const deleteCompany = async (req,res,next) => {
  try{
    const role = req.userData.user_role
    if (role !== 'admin') {
      return next (new HttpError('Unauthorized Access,only admin can delete!',403))
    }
    const companyId = req.params.id;
    const company = await Company.findByIdAndUpdate(
      companyId,
      { isDeleted: true },
      { new: true }
    );
    if (!company) {
      return next (new HttpError('company not found',404))
    } else {
      res.status(200).json({
        status: true,
        message: 'company deleted successfully',
        data: company,
      })
    }

  } catch (err) {
    console.error(err); 
    return next(new HttpError("Failed to delete company", 500));
  }
}

//list all companies
export const listCompanies = async (req, res, next) => {
  try {
    const role = req.userData.user_role;
    if (role !== 'admin') {
      return next(new HttpError("Unauthorized access!", 403));
    }

    // search 
    const search = req.query.query?.trim();
    const query = { isDeleted: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { industry: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const companies = await Company.find(query);

    res.status(200).json({
      status: true,
      message: null,
      data: companies,
    });

  } catch (err) {
    console.error(err);
    return next(new HttpError("Failed to fetch companies", 500));
  }
};



//view single company
export const viewOneCompany = async (req,res,next) => {
  try{
    // const role = req.userData.user_role;
    const companyId = req.params.id;

    let query = Company.findOne({ _id: companyId, isDeleted: false });

    // if (role !== 'admin') {
      query = query.select("name description location industry logo website");
    // }

    const company = await query;

    if (!company) {
      return next(new HttpError('Company not found',404));
    }

    res.status(200).json({
      status: true,
      message: null,
      data: company,
    });

  } catch (err) {
    console.error(err)
    return next (new HttpError('Failed to fetch company',500))
  }
}


