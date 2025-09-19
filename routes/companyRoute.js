import { Router } from "express";
import userAuthCheck from "../middlewares/authCheck.js";
import { addCompany, deleteCompany, editCompanyProfile, listCompanies,  viewOneCompany } from "../controllers/companyController.js";
import { uploadLogo } from "../middlewares/upload.js";
import { check } from "express-validator";


const companyRouter = Router()
companyRouter.use(userAuthCheck)

companyRouter.post('/add', uploadLogo.single('logo'),
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
  ],  addCompany)


companyRouter.patch('/edit/:id', uploadLogo.single('logo'),
  [
    check("name")
      .optional()
      .notEmpty().withMessage("Company name cannot be empty")
      .trim(),

    check("industry")
      .optional()
      .notEmpty().withMessage("Industry cannot be empty"),

    check("description")
      .optional()
      .notEmpty().withMessage("Description cannot be empty"),

    check("location")
      .optional()
      .notEmpty().withMessage("Location cannot be empty"),

    check("website")
      .optional()
      .isURL().withMessage("Website must be a valid URL"),

  ],
  editCompanyProfile
);


companyRouter.delete('/delete/:id',deleteCompany)
companyRouter.get('/list', listCompanies)
companyRouter.get('/view/:id',viewOneCompany)


export default companyRouter;