import ProductsDAO from "../dao/productsDAO";
import ApiError from "../error/ApiError";
export default class ProductController {
  static async addProduct(req, res, next) {
    try {
      const product = req.body;
      const data = await ProductsDAO.create(product);
      if (data.success) {
        res.status(201).json(data);
      }
    } catch (e) {
      next(ApiError.internal("Something went wrong"));
      return;
    }
  }
  static async listProduct(req, res, next) {
    try {
      const { page, productsPerPage } = req.query;
      const { productsList, totalNumProducts } = await ProductsDAO.getProducts({
        page,
        productsPerPage,
      });
      const response = {
        products: productsList,
        page: page,
        filters: {},
        entries_per_page: productsPerPage,
        total_results: totalNumProducts,
      };
      res.status(200).json(response);
    } catch (e) {
      next(ApiError.internal("Something went wrong"));
      return;
    }
  }

  static async getProductById(req, res, next) {
    try {
      const id = req.params.id;
      const response = await ProductsDAO.getById(id);
      if (response) {
        const product = response;
        res.status(200).json(product);
      }
    } catch (e) {
      next(ApiError.internal("Something went wrong"));
      return;
    }
  }
}
