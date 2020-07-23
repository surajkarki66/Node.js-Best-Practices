import makeDb from "../db";
import makeContactList from "./contacts-list";
import makeContactsEndpointHandler from "./contact-endpoint";

const database = makeDb();
const contactList = makeContactList({ database });
const contactsEndpointHandler = makeContactsEndpointHandler({ contactList });

export default contactsEndpointHandler;
