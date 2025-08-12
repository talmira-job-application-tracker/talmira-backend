import { Router } from "express";
import userAuthCheck from "../middlewares/authCheck.js";
import { addCompany, deleteCompany, editCompanyProfile, listCompanies,  viewOneCompany } from "../controllers/companyController.js";
import { uploadLogo } from "../middlewares/upload.js";
import { check } from "express-validator";


const companyRouter = Router()
companyRouter.use(userAuthCheck)

companyRouter.post('/addcompany', uploadLogo.single('logo'),
    [
    check("name")
      .notEmpty().withMessage("Company name is required")
      .isLength({ min: 2 }).withMessage("Company name must be at least 2 characters long"),
    
    check("industry")
      .notEmpty().withMessage("Industry is required"),
    
    check("location")
      .notEmpty().withMessage("Location is required"),

    check("website")
      .optional()
      .isURL().withMessage("Website must be a valid URL"),

    // check("logo")
    //   .optional()
    //   .isString().withMessage("Logo must be a valid string"),
  ],  addCompany)


companyRouter.patch('/editcompany/:id',uploadLogo.single('logo'),
  [
    check("name")
      .notEmpty().withMessage("Company name is required")
      .trim(),

    check("industry")
      .notEmpty().withMessage("Industry is required"),

    check("description")
      .notEmpty().withMessage("Description is required"),

    check("location")
      .notEmpty().withMessage("Location is required"),

    check("website")
      .notEmpty().withMessage("Website is required"),

    check("isDeleted")
      .notEmpty().withMessage("isDeleted is required"),
  ],
  editCompanyProfile
);

companyRouter.delete('/deletecompany/:id',deleteCompany)
companyRouter.get('/listallcompanies', listCompanies)//also have search
companyRouter.get('/viewonecompany/:id',viewOneCompany)


export default companyRouter;