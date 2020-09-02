import BlogsDAO from "../dao/blogsDAO";
import ApiError from "../error/ApiError";
export default class BlogController {
  static async addBlog(req, res, next) {
    try {
      const blogFromBody = req.body;
      const data = await BlogsDAO.create(blogFromBody);
      if (data.success) {
        return res.status(201).json({ success: true, data });
      }
    } catch (e) {
      next(ApiError.internal("Something went wrong"));
      return;
    }
  }
  static async listBlogs(req, res, next) {
    try {
      const { page, blogsPerPage } = req.query;
      const { blogsList, totalNumBlogs } = await BlogsDAO.getBlogs({
        page,
        blogsPerPage,
      });
      const response = {
        blogs: blogsList,
        page: page,
        filters: {},
        entries_per_page: blogsPerPage,
        total_results: totalNumBlogs,
      };
      res.status(200).json(response);
    } catch (e) {
      next(ApiError.internal("Something went wrong"));
      return;
    }
  }
  static async searchBlogs(req, res, next) {
    const { page, blogsPerPage } = req.query;
    let searchType;
    try {
      searchType = Object.keys(req.query)[0];
    } catch (error) {
      next(ApiError.internal(`No search keys specified: ${error}`));
      return;
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
      next(ApiError.internal(`Something went wrong while searching blogs.`));
      return;
    }
  }
  static async getBlogById(req, res) {
    const id = req.params.id;
    try {
      const response = await BlogsDAO.getById(id);
      if (response) {
        const blog = response[0];
        res.status(200).json(blog);
      }
    } catch (e) {
      next(ApiError.internal(`Something went wrong`));
      return;
    }
  }
}
