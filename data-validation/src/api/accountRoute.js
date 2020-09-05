import { Router } from "express";

import accountCtrl from "./accountController";
import dataValidation from "../middleware/data-validation";
import accountSchemas from "../helper/accountSchema";

const router = new Router();
router
  .route("/signup")
  .post(dataValidation(accountSchemas.accountSIGNUP, "body"))
  .post(accountCtrl.signup);

router
  .route("/login")
  .post(dataValidation(accountSchemas.accountLOGIN, "body"))
  .post(accountCtrl.login);

export default router;
