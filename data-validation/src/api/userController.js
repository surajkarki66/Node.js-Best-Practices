import UsersDAO from "../dao/usersDAO";
import ApiError from "../error/ApiError";
export default class UserController {
  static async addUser(req, res, next) {
    try {
      const user = req.body;
      const data = await UsersDAO.create(user);
      if (data.success) {
        res.status(201).json({ success: true });
      }
    } catch (e) {
      next(ApiError.internal("Something went wrong"));
      return;
    }
  }
  static async listUser(req, res, next) {
    try {
      const { page, usersPerPage } = req.query;
      const { usersList, totalNumUsers } = await UsersDAO.getUsers({
        page,
        usersPerPage,
      });
      const response = {
        users: usersList,
        page: page,
        filters: {},
        entries_per_page: usersPerPage,
        total_results: totalNumUsers,
      };
      res.status(200).json(response);
    } catch (e) {
      next(ApiError.internal("Something went wrong"));
      return;
    }
  }
}
