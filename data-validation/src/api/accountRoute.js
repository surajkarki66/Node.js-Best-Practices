import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();

import accountCtrl from "./accountController";
import checkAuth from "../middleware/auth-validation";
import dataValidation from "../middleware/data-validation";
import accountSchemas from "../helper/accountSchema";

const permission = require("../middleware/auth-permission");
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

router
  .route("/users")
  .get(checkAuth)
  .get(dataValidation(accountSchemas.accountLIST, "query"))
  .get(permission.onlyAdminCanDoThisAction)
  .get(accountCtrl.listAccounts);

router
  .route("/:id")
  .get(checkAuth)
  .get(dataValidation(accountSchemas.accountDETAIL, "params"))
  .get(permission.onlySameUserOrAdminCanDoThisAction)
  .get(accountCtrl.getAccountById);

router
  .route("/update/:id")
  .post(checkAuth)
  .post(dataValidation(accountSchemas.accountUPDATE, "body"))
  .post(permission.onlySameUserOrAdminCanDoThisAction)
  .post(accountCtrl.update);

router
  .route("/resetPassword/:id")
  .post(checkAuth)
  .post(dataValidation(accountSchemas.accountRESETPASSWORD, "body"))
  .post(permission.sameUserCantDoThisAction)
  .post(accountCtrl.resetPassword);
export default router;
