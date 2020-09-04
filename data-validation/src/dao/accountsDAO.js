import logger from "../utils/logger";

let accounts;

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
        },
        { w: "major" }
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
}

export default AccountsDAO;
