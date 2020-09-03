import { ObjectId } from "bson";

import logger from "../utils/logger";
let products;
const DEFAULT_SORT = [["name", -1]];
export default class ProductsDAO {
  static async injectDB(conn) {
    if (products) {
      return;
    }
    try {
      products = await conn.db(process.env.NS).collection("products");
    } catch (e) {
      logger.error(
        `Error while injecting DB: ${e.message}`,
        "ProductsDAO.injectDB()"
      );
      throw e;
    }
  }

  static async create(productInfo) {
    try {
      const result = await products.insertOne(productInfo);
      return { data: { createdId: result.insertedId }, statusCode: 201 };
    } catch (e) {
      logger.error("Error occurred: " + e.message, "create()");
      throw e;
    }
  }

  static async getProducts({
    filters = null,
    page = 0,
    productsPerPage = 10,
  } = {}) {
    let queryParams = {};
    let { query = {}, project = {}, sort = DEFAULT_SORT } = queryParams;
    let cursor;
    try {
      cursor = await products.find(query).project(project).sort(sort);
    } catch (e) {
      logger.error(`Unable to issue find command, ${e.message}`);
      return {
        data: [],
        totalNumProducts: 0,
        statusCode: 404,
      };
    }
    const displayCursor = cursor
      .skip(parseInt(page) * parseInt(productsPerPage))
      .limit(parseInt(productsPerPage));
    try {
      const documents = await displayCursor.toArray();
      const totalNumProducts =
        parseInt(page) === 0 ? await products.countDocuments(query) : 0;
      return {
        data: documents,
        totalNumProducts,
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
    try {
      const pipeline = [
        {
          $match: {
            _id: ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "parts",
            localField: "parts",
            foreignField: "_id",
            as: "parts",
          },
        },
      ];
      return await products.aggregate(pipeline).next();
    } catch (e) {
      logger.error(`Something went wrong, ${e.message}`, "getById()");
      throw e;
    }
  }
}

/*
  static async addPart(product_id, part_id) {
    try {
      await products.updateOne(
        { _id: ObjectId(product_id) },
        {
          $push: {
            parts: {
              $each: [ObjectId(part_id)],
            },
          },
        }
      );
      return { success: true };
    } catch (e) {
      console.error(e.message);
      return;
    }
  }

*/
