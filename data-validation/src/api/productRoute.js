import { Router } from "express";

import productCtrl from "./productController";
import dataValidation from "../middleware/data-validation";
import productSchemas from "../helper/productSchemas";

const router = new Router();

router
  .route("/create")
  .post(dataValidation(productSchemas.productPOST, "body"))
  .post(productCtrl.addProduct);
router
  .route("/")
  .get(dataValidation(productSchemas.productLIST, "query"))
  .get(productCtrl.listProduct);

router
  .route("/:id")
  .get(dataValidation(productSchemas.productDETAIL, "params"))
  .get(productCtrl.getProductById);

export default router;
