import { Router } from "express";

import studentCtrl from "./studentController";
import dataValidation from "../middleware/data-validation";
import studentSchemas from "../helper/studentSchemas";

const router = new Router();

// associate put, delete, and get(id)
router
  .route("/create")
  .post(dataValidation(studentSchemas.studentPOST, "body"))
  .post(studentCtrl.addStudent);

router
  .route("/")
  .get(dataValidation(studentSchemas.studentLIST, "query"))
  .get(studentCtrl.listStudents);

router
  .route("/search")
  .get(dataValidation(studentSchemas.studentLIST, "query"))
  .get(studentCtrl.searchStudents);

router
  .route("/facetSearch")
  .get(dataValidation(studentSchemas.studentFACETED, "query"))
  .get(studentCtrl.studentsFacetedSearch);

router
  .route("/:id")
  .get(dataValidation(studentSchemas.studentDETAIL, "params"))
  .get(studentCtrl.getStudentsById);

export default router;
