import { Router } from "express";

import studentCtrl from "./studentController";
import dataValidation from "../middleware/data-validation";
import studentSchemas from "../helper/studentSchemas";

const router = new Router();

// associate put, delete, and get(id)
router
  .route("/create")
  .post(dataValidation(studentSchemas.studentPOST, "body"))
  .post(studentCtrl.create);

export default router;
