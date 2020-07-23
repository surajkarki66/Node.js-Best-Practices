import express from "express";

import handleContactsRequest from "./contacts";
import adaptRequest from "./helpers/adapt-request";

const app = express();
app.use(express.json());

app.all("/contacts", contactsController);
app.get("/contacts/:id", contactsController);
app.delete("/contacts/:id", contactsController);

function contactsController(req, res) {
  const httpRequest = adaptRequest(req);
  handleContactsRequest(httpRequest)
    .then(({ headers, statusCode, data }) =>
      res.set(headers).status(statusCode).send(data)
    )
    .catch((e) => {
      console.log(e);
      res.status(500).end();
    });
}

app.listen(5000, () => {
  console.log("Listening on PORT 5000");
});
