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
  static async listBlogs(req, res, next) {
    const { page, blogsPerPage } = req.query;
    const { blogsList, totalNumBlogs } = await BlogsDAO.getBlogs({
      page,
      blogsPerPage,
    });
    let response = {
      blogs: blogsList,
      page: page,
      filters: {},
      entries_per_page: blogsPerPage,
      total_results: totalNumBlogs,
    };
    res.json(response);
  }
  static async searchBlogs(req, res, next) {
    const { page, blogsPerPage } = req.query;
    let searchType;
    try {
      searchType = Object.keys(req.query)[0];
    } catch (error) {
      console.error(`No search keys specified: ${error}`);
    }
    let filters = {};
    switch (searchType) {
      case "text":
        if (req.query.text !== "") {
          filters.text = req.query.text;
        }
        break;
      default:
        filters = {};
        break;
    }
    try {
      const { blogsList, totalNumBlogs } = await BlogsDAO.getBlogs({
        filters,
        page,
        blogsPerPage,
      });

      const response = {
        blogs: blogsList,
        page: page,
        filters,
        entries_per_page: blogsPerPage,
        total_results: totalNumBlogs,
      };
      res.status(200).json(response);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
