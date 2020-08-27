import { Router } from "express";

import blogCtrl from "./blogController";
import dataValidation from "../middleware/data-validation";
import blogSchemas from "../helper/blogSchemas";

const router = new Router();

// associate put, delete, and get(id)
router
  .route("/create")
  .post(dataValidation(blogSchemas.blogPOST, "body"))
  .post(blogCtrl.create);
router
  .route("/")
  .get(dataValidation(blogSchemas.blogLIST, "query"))
  .get(blogCtrl.listBlogs);

router
  .route("/search")
  .get(dataValidation(blogSchemas.blogLIST, "query"))
  .get(blogCtrl.searchBlogs);

router
  .route("/:id")
  .get(dataValidation(blogSchemas.blogDETAIL, "params"))
  .get(blogCtrl.getBlogById);
export default router;
