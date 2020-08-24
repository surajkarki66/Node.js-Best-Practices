import { Router } from "express";

import blogCtrl from "./blogController";
import dataValidation from "../middleware/data-validation";
import schemas from "../helper/schemas";

const router = new Router();

// associate put, delete, and get(id)
router
  .route("/create")
  .post(dataValidation(schemas.blogPOST, "body"))
  .post(blogCtrl.create);

export default router;
