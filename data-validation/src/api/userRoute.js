import { Router } from "express";

import userCtrl from "./userController";
import dataValidation from "../middleware/data-validation";
import userSchemas from "../helper/userSchemas";

const router = new Router();

router
  .route("/create")
  .post(dataValidation(userSchemas.userPOST, "body"))
  .post(userCtrl.addUser);
router
  .route("/")
  .get(dataValidation(userSchemas.userLIST, "query"))
  .get(userCtrl.listUser);

export default router;
