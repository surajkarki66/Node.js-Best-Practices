import handleContactsRequest from "./index";
import adaptRequest from "../helpers/adapt-request";
export default function contactsController(req, res) {
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
