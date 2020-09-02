import PartsDAO from "../dao/partsDAO";
import ApiError from "../error/ApiError";
export default class PartController {
  static async addPart(req, res, next) {
    try {
      const part = req.body;
      const data = await PartsDAO.create(part);
      if (data.success) {
        res.status(201).json(data);
      }
    } catch (e) {
      next(ApiError.internal("Something went wrong"));
      return;
    }
  }
  static async listPart(req, res) {
    try {
      const { page, partsPerPage } = req.query;
      const { partsList, totalNumParts } = await PartsDAO.getParts({
        page,
        partsPerPage,
      });
      const response = {
        parts: partsList,
        page: page,
        filters: {},
        entries_per_page: partsPerPage,
        total_results: totalNumParts,
      };
      res.status(200).json(response);
    } catch (e) {
      next(ApiError.internal("Something went wrong"));
      return;
    }
  }
}
