import { Router } from "express";
import { addJob, deleteJob, editJob, listJob, searchJob, viewJob } from "../controllers/jobController.js";
import userAuthCheck from "../middlewares/authCheck.js";

const jobRouter = Router()
jobRouter.use(userAuthCheck)

jobRouter.get('/list', listJob);
jobRouter.get('/:id', viewJob);
jobRouter.post('/add', addJob);
jobRouter.patch('/:id', editJob);
jobRouter.delete('/:id', deleteJob);
// jobRouter.get('/search', searchJob);
jobRouter.get('/search', (req, res, next) => {
  console.log("🔍 Search route hit");
  searchJob(req, res, next);
});

export default jobRouter