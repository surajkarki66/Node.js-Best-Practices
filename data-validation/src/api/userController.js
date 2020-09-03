import UsersDAO from "../dao/usersDAO";
import ApiError from "../error/ApiError";
import writeServerJsonResponse from "../utils/utils";
export default class UserController {
  static async addUser(req, res, next) {
    try {
      const user = req.body;
      const result = await UsersDAO.create(user);
      if (result) {
        writeServerJsonResponse(res, result.data, result.statusCode);
      }
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
  static async listUser(req, res, next) {
    try {
      const { page, usersPerPage } = req.query;
      const result = await UsersDAO.getUsers({
        page,
        usersPerPage,
      });
      const users = {
        users: result.data,
        page: page,
        filters: {},
        entries_per_page: usersPerPage,
        total_results: result.totalNumUsers,
      };
      writeServerJsonResponse(res, users, result.statusCode);
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
}
