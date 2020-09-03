import { ObjectId } from "bson";

import logger from "../utils/logger";
let blogs;
const DEFAULT_SORT = [["year", -1]];
export default class BlogsDAO {
  static async injectDB(conn) {
    if (blogs) {
      return;
    }
    try {
      blogs = await conn.db(process.env.NS).collection("blogs");
      logger.info(
        `Connected to blogs collection of ${process.env.NS} database.`,
        "BlogsDAO.injectDB()"
      );
    } catch (e) {
      logger.error(
        `Error while injecting DB: ${e.message}`,
        "BlogsDAO.injectDB()"
      );
      throw e;
    }
  }

  static async create(blogInfo) {
    try {
      const result = await blogs.insertOne(blogInfo);
      return { data: { createdId: result.insertedId }, statusCode: 201 };
    } catch (e) {
      logger.error("Error occurred: " + e.message, "create()");
      throw e;
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
      logger.error(`Unable to issue find command, ${e.message}`);
      return {
        data: [],
        totalNumBlogs: 0,
        statusCode: 404,
      };
    }
    const displayCursor = cursor
      .skip(parseInt(page) * parseInt(blogsPerPage))
      .limit(parseInt(blogsPerPage));
    try {
      const documents = await displayCursor.toArray();
      const totalNumBlogs =
        parseInt(page) === 0 ? await blogs.countDocuments(query) : 0;
      return {
        data: documents,
        totalNumBlogs,
        statusCode: documents.length > 0 ? 200 : 404,
      };
    } catch (e) {
      logger.error(
        `Unable to convert cursor to array or problem counting documents, ${e.message}`
      );
      throw e;
    }
  }
  static async getById(id) {
    let cursor;
    try {
      const query = { _id: ObjectId(id) };
      cursor = await blogs.find(query).sort(DEFAULT_SORT);
      logger.info(
        `Connected to blog collection of ${process.env.NS} database.`,
        "BlogsDAO.injectDB()"
      );
    } catch (e) {
      logger.error("Error occurred: " + e.message, "getById()");
      throw e;
    }
    try {
      const blog = await cursor.toArray();
      if (blog) {
        return { data: blog, statusCode: 200 };
      } else {
        const message = "No document matching id: " + id + " could be found!";
        logger.error(message, "getById()");
        return { data: [], statusCode: 404 };
      }
    } catch (e) {
      logger.error(
        `Unable to convert cursor to array or problem counting documents, ${e.message}`,
        "getById()"
      );
      throw e;
    }
  }
}
