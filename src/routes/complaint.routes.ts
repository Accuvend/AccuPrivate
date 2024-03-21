import express, { Router} from "express";
import { AuthenticatedController } from "../utils/Interface";
import { ComplaintController } from "../controllers/Admin/Complaint.controller";
import FileUploadService from "../utils/FileUpload";

export const router: Router = express.Router();

router
    .get('/id',FileUploadService.multerUpload.single('complaint_image'),AuthenticatedController(ComplaintController.getComplaint))
    .post('/create',AuthenticatedController(ComplaintController.createComplaint))
    .get('/all',AuthenticatedController(ComplaintController.getComplaints))
    .patch('/update/:id',AuthenticatedController(ComplaintController.updateComplaint))
    .get('/replies/:id',AuthenticatedController(ComplaintController.getComplaintRely))
    .post('/reply/create/:id',AuthenticatedController(ComplaintController.addComplaintReply))
    


export default router