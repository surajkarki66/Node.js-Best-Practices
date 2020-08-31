import UsersDAO from "../dao/usersDAO";
export default class UserController {
  static async addUser(req, res) {
    try {
      const user = req.body;
      const data = await UsersDAO.create(user);
      if (data.success) {
        res.status(201).json({ success: true });
      }
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
  static async listUser(req, res) {
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
      res.json(response);
    } catch (e) {
      console.log(e);
    }
  }
}
