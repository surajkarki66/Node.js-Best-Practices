import { UniqueConstraintError } from "../helpers/errors";
import makeContact from "./contact";

export default function makeContactList({ database }) {
  return Object.freeze({
    getItems,
    add,
    findById,
  });

  async function getItems({ max = 100, before, after } = {}) {
    const db = await database;
    const query = {};
    if (before || after) {
      query._id = {};
      query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id;
      query._id = after ? { ...query._id, $gt: db.makeId(after) } : query._id;
    }

    return (
      await db.collection("contacts").find(query).limit(Number(max)).toArray()
    ).map(documentToContact);
  }

  async function add({ contactId, ...contact }) {
    const db = await database;
    if (contactId) {
      contact._id = db.makeId(contactId);
    }
    const { result, ops } = await db
      .collection("contacts")
      .insertOne(contact)
      .catch((mongoError) => {
        const [errorCode] = mongoError.message.split(" ");
        if (errorCode === "E11000") {
          const [_, mongoIndex] = mongoError.message.split(":")[2].split(" ");
          throw new UniqueConstraintError(
            mongoIndex === "ContactEmailIndex" ? "emailAddress" : "contactId"
          );
        }
        throw mongoError;
      });
    return {
      success: result.ok === 1,
      created: documentToContact(ops[0]),
    };
  }
  async function findById({ contactId }) {
    const db = await database;
    const found = await db
      .collection("contacts")
      .findOne({ _id: db.makeId(contactId) });
    if (found) {
      return documentToContact(found);
    }
    return null;
  }
  async function findByEmail({ emailAddress }) {
    const db = await database;
    const results = await db
      .collection("contacts")
      .find({ emailAddress })
      .toArray();
    return results.map(documentToContact);
  }

  function documentToContact({ _id: contactId, ...doc }) {
    return makeContact({ contactId, ...doc });
  }
}
