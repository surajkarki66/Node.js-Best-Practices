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
router
  .route("/")
  .get(dataValidation(schemas.blogLIST, "query"))
  .get(blogCtrl.listBlogs);

router
  .route("/search")
  .get(dataValidation(schemas.blogLIST, "query"))
  .get(blogCtrl.searchBlogs);

router
  .route("/:id")
  .get(dataValidation(schemas.blogDETAIL, "params"))
  .get(blogCtrl.getBlogById);
export default router;
