import express from "express";

import contactsController from "./contacts/contact.controller";
const app = express();
app.use(express.json());

app.all("/contacts", contactsController);
app.get("/contacts/:id", contactsController);
app.delete("/contacts/:id", contactsController);

app.listen(5000, () => {
  console.log("Listening on PORT 5000");
});
