import { Router } from "express";

import accountCtrl from "./accountController";
import dataValidation from "../middleware/data-validation";
import accountSchemas from "../helper/accountSchema";

const router = new Router();
router
  .route("/signup")
  .post(dataValidation(accountSchemas.accountSIGNUP, "body"))
  .post(accountCtrl.signup);

export default router;
