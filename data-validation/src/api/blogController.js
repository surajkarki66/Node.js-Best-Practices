import BlogsDAO from "../dao/blogsDAO";
export default class BlogController {
  static async create(req, res) {
    try {
      const blogFromBody = req.body;
      const data = await BlogsDAO.addBlog(blogFromBody);
      if (data.success) {
        res.status(201).json({ success: true });
      }
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
}
