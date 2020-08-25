import { ObjectId } from "bson";
let blogs;
const DEFAULT_SORT = [["year", -1]];
export default class BlogsDAO {
  static async injectDB(conn) {
    if (blogs) {
      return;
    }
    try {
      blogs = await conn.db(process.env.NS).collection("blogs");
    } catch (e) {
      console.error(`Unable to establish collection handles in blogDAO: ${e}`);
    }
  }

  static async addBlog(blogInfo) {
    try {
      await blogs.insertOne(blogInfo);
      return { success: true };
    } catch (e) {
      return { error: e };
    }
  }
  static textSearchQuery(text) {
    const query = { $text: { $search: text } };
    const sort = [["title", 1]];
    const project = {};
    return { query, project, sort };
  }

  static async getBlogs({ filters = null, page = 0, blogsPerPage = 10 } = {}) {
    let queryParams = {};
    if (filters) {
      if (filters.text !== "") {
        queryParams = this.textSearchQuery(filters["text"]);
      }
    }
    let { query = {}, project = {}, sort = DEFAULT_SORT } = queryParams;
    let cursor;
    try {
      cursor = await blogs.find(query).project(project).sort(sort);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { moviesList: [], totalNumMovies: 0 };
    }
    const displayCursor = cursor
      .skip(parseInt(page) * parseInt(blogsPerPage))
      .limit(parseInt(blogsPerPage));
    try {
      const blogsList = await displayCursor.toArray();
      const totalNumBlogs = page === 0 ? await blogs.countDocuments(query) : 0;
      return { blogsList, totalNumBlogs };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { blogsList: [], totalNumBlogs: 0 };
    }
  }
  static async getById(id) {
    let cursor;
    try {
      const query = { _id: ObjectId(id) };
      cursor = await blogs.find(query).sort(DEFAULT_SORT);
    } catch (e) {
      res.status(500).json(e);
    }
    try {
      const blog = await cursor.toArray();
      return blog;
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
