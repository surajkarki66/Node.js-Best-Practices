import ProductsDAO from "../dao/productsDAO";
export default class ProductController {
  static async addProduct(req, res) {
    try {
      const product = req.body;
      const data = await ProductsDAO.create(product);
      if (data.success) {
        res.status(201).json(data);
      }
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
  static async listProduct(req, res) {
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
      res.json(response);
    } catch (e) {
      console.log(e);
    }
  }

  static async getProductById(req, res) {
    const id = req.params.id;
    try {
      const response = await ProductsDAO.getById(id);
      if (response) {
        const product = response;
        res.status(200).json(product);
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
