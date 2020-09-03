import ProductsDAO from "../dao/productsDAO";
import ApiError from "../error/ApiError";
import writeServerJsonResponse from "../utils/utils";
export default class ProductController {
  static async addProduct(req, res, next) {
    try {
      const product = req.body;
      const result = await ProductsDAO.create(product);
      if (result) {
        writeServerJsonResponse(res, result.data, result.statusCode);
      }
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
  static async listProduct(req, res, next) {
    try {
      const { page, productsPerPage } = req.query;
      const result = await ProductsDAO.getProducts({
        page,
        productsPerPage,
      });
      const product = {
        products: result.data,
        page: page,
        filters: {},
        entries_per_page: productsPerPage,
        total_results: result.totalNumProducts,
      };
      writeServerJsonResponse(res, product, result.statusCode);
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }

  static async getProductById(req, res, next) {
    try {
      const id = req.params.id;
      const result = await ProductsDAO.getById(id);
      if (result) {
        writeServerJsonResponse(res, result, 200);
      }
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
}
