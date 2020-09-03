import BlogsDAO from "../dao/blogsDAO";
import ApiError from "../error/ApiError";
import writeServerJsonResponse from "../utils/utils";
export default class BlogController {
  static async addBlog(req, res, next) {
    try {
      const blogFromBody = req.body;
      const result = await BlogsDAO.create(blogFromBody);
      if (result) {
        writeServerJsonResponse(res, result.data, result.statusCode);
      }
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
  static async listBlogs(req, res, next) {
    try {
      const { page, blogsPerPage } = req.query;
      const result = await BlogsDAO.getBlogs({
        page,
        blogsPerPage,
      });

      const blogs = {
        blogs: result.data,
        page: page,
        filters: {},
        entries_per_page: blogsPerPage,
        total_results: result.totalNumBlogs,
      };
      writeServerJsonResponse(res, blogs, result.statusCode);
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
  static async searchBlogs(req, res, next) {
    const { page, blogsPerPage } = req.query;
    let searchType;
    try {
      searchType = Object.keys(req.query)[0];
    } catch (error) {
      next(ApiError.internal(`No search keys specified: ${error.message}`));
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
      const result = await BlogsDAO.getBlogs({
        filters,
        page,
        blogsPerPage,
      });

      const blogs = {
        blogs: result.data,
        page: page,
        filters,
        entries_per_page: blogsPerPage,
        total_results: result.totalNumBlogs,
      };
      writeServerJsonResponse(res, blogs, result.statusCode);
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
  static async getBlogById(req, res, next) {
    const id = req.params.id;
    try {
      const result = await BlogsDAO.getById(id);
      if (result) {
        writeServerJsonResponse(res, result.data[0], result.statusCode);
      }
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
}
