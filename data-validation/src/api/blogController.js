export default class BlogController {
  static async create(req, res) {
    try {
      const blogFromBody = req.body;
      res.status(201).json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
}
