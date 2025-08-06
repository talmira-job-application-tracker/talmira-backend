import { Router } from "express";
import userAuthCheck from "../middlewares/authCheck.js";
import { addCompany, deleteCompany, editCompanyProfile, listCompanies, searchCompanies, viewOneCompany } from "../controllers/companyController.js";


const companyRouter = Router()

companyRouter.use(userAuthCheck)

companyRouter.post('/addcompany', addCompany)
companyRouter.patch('/editcompany/:id', editCompanyProfile)
companyRouter.delete('/deletecompany/:id',deleteCompany)
companyRouter.get('/listallcompanies', listCompanies)
companyRouter.get('/viewonecompany/:id',viewOneCompany)
companyRouter.get('/search',searchCompanies)

export default companyRouter;