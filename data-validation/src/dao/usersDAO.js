let users;
const DEFAULT_SORT = [["name", 1]];
export default class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db(process.env.NS).collection("users");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }
  static async create(userInfo) {
    try {
      const data = await users.insertOne(userInfo);
      const user = data.ops[0];
      return { success: true, user };
    } catch (e) {
      return;
    }
  }
  static async getUsers({ filters = null, page = 0, usersPerPage = 10 } = {}) {
    let queryParams = {};

    let { query = {}, project = {}, sort = DEFAULT_SORT } = queryParams;
    let cursor;
    try {
      cursor = await users.find(query).project(project).sort(sort);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { usersList: [], totalNumUsers: 0 };
    }
    const displayCursor = cursor
      .skip(parseInt(page) * parseInt(usersPerPage))
      .limit(parseInt(usersPerPage));
    try {
      const usersList = await displayCursor.toArray();
      const totalNumUsers =
        parseInt(page) === 0 ? await users.countDocuments(query) : 0;
      return { usersList, totalNumUsers };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { usersList: [], totalNumUsers: 0 };
    }
  }
}

/*

<<<<<<<<<<<<<<<<<<<<<<<<<< Query an Array of Embedded Documents >>>>>>>>>>>>>>>>>>>>>>>>>>>

// CMD: in mongo shell
db.user.find({
  address: {
    street: "Buddhauli",
    city: "Khairahani",
    cc: "Nepal",
  },
});


// In Node.js
const cursor = db.collection("users").find({
  address: {
    street: "Buddhauli",
    city: "Khairahani",
    cc: "Nepal",
  },
});


// Specify a Query Condition on a Field in an Array of Documents¶
// Specify a Query Condition on a Field Embedded in an Array of Documents

// If you do not know the index position of the document nested in the array, concatenate the name of the array field, with a dot (.) and the name of the field in the nested document.
// CMD in mongo shell
db.users.find({ "address.cc": "Nepal" });
db.users.find({ "address.city": "Khairahani" });


// in node.js
const cursor = db.collection("users").find({
  "address.cc": "Nepal",
});
const cursor = db.collection("users").find({
  "address.city": "Khairahani",
});



// Use the Array Index to Query for a Field in the Embedded Document
db.user.find({ "address.1.cc": "USA" });
db.user.find({ "address.0.street": "Rani Ban" });

// In node.js
const cursor = db.collection("users").find({
  "address.0.street": "Rani Ban",
});



//Specify Multiple Conditions for Array of Documents
//A Single Nested Document Meets Multiple Query Conditions on Nested Fields¶

db.users.find({
  address: {
    $elemMatch: { city: "Khairahani", street: "Buddhauli", cc: "Nepal" },
  },
});

const cursor = db.collection("inventory").find({
  address: {
    $elemMatch: { city: "Khairahani", street: "Buddhauli", cc: "Nepal" },
  },
});





<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Updating array of embedded documents >>>>>>>>>>>>>>>>>>>>>>>>>
// You must include the array field as part of the query document.
db.users.updateOne(
   { name: "Binish", "address.city": "Bhaktapur" },
   { $set: { "address.$.city" : "Kathmandu" } }
)



<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Removing a document from a array of embedded documents >>>>>>>>>>>>>>>>>>>>>>>>>

// Remove Items from an Array of Documents
db.users.update(
  {name: "Binish" },
  { $pull: { address: { street: "1 Avenue" , city: "California", cc: "USA" } } },
  { multi: true }
)



db.users.update(
  {name: "Binish"},
  { $pull: { address: { $elemMatch: { street: "1 Avenue" , city: "California", cc: "USA" } } } },
  { multi: true }
)

<<<<<<<<<<<<<<<<<<<<<<<<<<  Adding a document in a array of embedded documents >>>>>>>>>>>>>>>>>>>>>>>>>
// Use $push Operator with Multiple Modifiers
db.users.update(
   { name: "Binish" },
   {
     $push: {
       address: {
          $each: [ { street: "1 Avenue" , city: "California", cc: "USA" }],  // you can also push multiple document.
          $sort: { cc: -1 },
          $slice: 2
       }
     }
   }
)



*/
