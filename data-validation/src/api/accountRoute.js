import { Router } from "express";

import accountCtrl from "./accountController";
import checkAuth from "../middleware/auth-validation";
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

router
  .route("/delete")
  .post(checkAuth)
  .post(dataValidation(accountSchemas.accountDELETE, "body"))
  .post(accountCtrl.delete);

export default router;
