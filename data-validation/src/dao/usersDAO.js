import { ObjectId } from "bson";
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
      await users.insertOne(userInfo);
      return { success: true };
    } catch (e) {
      return { error: e };
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
