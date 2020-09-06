import { ObjectId } from "mongodb";

import logger from "../utils/logger";

let accounts;
const DEFAULT_SORT = [["username", -1]];

class AccountsDAO {
  static async injectDB(conn) {
    if (accounts) {
      return;
    }
    try {
      accounts = await conn.db("tutorial").collection("accounts");
      logger.info(
        `Connected to accounts collection of ${process.env.NS} database.`,
        "AccountsDAO.injectDB()"
      );
    } catch (e) {
      logger.error(
        `Error while injecting DB: ${e.message}`,
        "AccountsDAO.injectDB()"
      );
      throw e;
    }
  }
  static async getUsers({ page = 0, usersPerPage = 10 } = {}) {
    const sort = DEFAULT_SORT;
    let cursor;
    try {
      cursor = await accounts.find({}).project({}).sort(sort);
    } catch (e) {
      logger.error(`Unable to issue find command, ${e.message}`);
      return {
        data: [],
        totalNumUsers: 0,
        statusCode: 404,
      };
    }
    const displayCursor = cursor
      .skip(parseInt(page) * parseInt(usersPerPage))
      .limit(parseInt(usersPerPage));
    try {
      const documents = await displayCursor.toArray();
      const totalNumUsers =
        parseInt(page) === 0 ? await accounts.countDocuments({}) : 0;
      return {
        data: documents,
        totalNumUsers,
        statusCode: documents.length > 0 ? 200 : 404,
      };
    } catch (e) {
      logger.error(
        `Unable to convert cursor to array or problem counting documents, ${e.message}`
      );
      throw e;
    }
  }
  static async getUserById(id) {
    let cursor;
    try {
      const query = { _id: ObjectId(id) };
      cursor = await accounts.find(query).sort(DEFAULT_SORT);
    } catch (e) {
      logger.error("Error occurred: " + e.message, "getUserById()");
      throw e;
    }
    try {
      const user = await cursor.toArray();
      if (user) {
        return { data: user, statusCode: 200 };
      } else {
        const message = "No document matching id: " + id + " could be found!";
        logger.error(message, "getUserById()");
        return { data: [], statusCode: 404 };
      }
    } catch (e) {
      logger.error(
        `Unable to convert cursor to array or problem counting documents, ${e.message}`,
        "getUserById()"
      );
      throw e;
    }
  }
  static async getUserByEmail(email) {
    return await accounts.findOne({ email: email });
  }
  static async getUserByUsername(username) {
    return await accounts.findOne({ username: username });
  }
  static async addUser(userInfo) {
    try {
      const result = await accounts.insertOne(
        {
          username: userInfo.username,
          email: userInfo.email,
          password: userInfo.password,
          role: userInfo.role,
        },
        { w: 2 }
      );
      const data = result.ops[0];

      return { data: data, statusCode: 201 };
    } catch (e) {
      logger.error(
        "Error occurred while adding new user: " + e.message,
        "addUser()"
      );
      throw e;
    }
  }
  static async deleteUser(email) {
    try {
      await accounts.deleteOne({ email });
      if (!(await this.getUserByEmail(email))) {
        return { success: true };
      } else {
        return { error: `Deletion unsuccessful` };
      }
    } catch (e) {
      logger.error(`Error occurred while deleting user, ${e}`, "deleteUser()");
      throw e;
    }
  }
}

export default AccountsDAO;
