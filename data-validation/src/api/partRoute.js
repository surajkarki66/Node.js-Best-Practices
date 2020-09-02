import { Router } from "express";

import partCtrl from "./partController";
import dataValidation from "../middleware/data-validation";
import partSchemas from "../helper/partSchemas";

const router = new Router();

router
  .route("/create")
  .post(dataValidation(partSchemas.partPOST, "body"))
  .post(partCtrl.addPart);
router
  .route("/")
  .get(dataValidation(partSchemas.partLIST, "query"))
  .get(partCtrl.listPart);

export default router;
