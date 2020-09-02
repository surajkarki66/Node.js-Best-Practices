import { ObjectId } from "bson";
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
      console.error(
        `Unable to establish collection handles in productDAO: ${e}`
      );
    }
  }

  static async create(productInfo) {
    try {
      const data = await products.insertOne(productInfo);
      const product = data.ops[0];
      return { success: true, product };
    } catch (e) {
      console.error(e.message);
      return;
    }
  }
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
      console.error(`Unable to issue find command, ${e}`);
      return { productsList: [], totalNumProducts: 0 };
    }
    const displayCursor = cursor
      .skip(parseInt(page) * parseInt(productsPerPage))
      .limit(parseInt(productsPerPage));
    try {
      const productsList = await displayCursor.toArray();
      const totalNumProducts =
        parseInt(page) === 0 ? await products.countDocuments(query) : 0;
      return { productsList, totalNumProducts };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { productsList: [], totalNumProducts: 0 };
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
      // here's how the InvalidId error is identified and handled
      if (
        e
          .toString()
          .startsWith(
            "Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
          )
      ) {
        return null;
      }
      // if (e.name === "Error") {return null} also good
      console.error(`Something went wrong in getProductsByID: ${e}`);
      throw e;
    }
  }
}
