import PartsDAO from "../dao/partsDAO";
import ApiError from "../error/ApiError";
import writeServerJsonResponse from "../utils/utils";
export default class PartController {
  static async addPart(req, res, next) {
    try {
      const part = req.body;
      const result = await PartsDAO.create(part);
      if (result) {
        writeServerJsonResponse(res, result.data, result.statusCode);
      }
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
  static async listPart(req, res) {
    try {
      const { page, partsPerPage } = req.query;
      const result = await PartsDAO.getParts({
        page,
        partsPerPage,
      });
      const part = {
        parts: result.data,
        page: page,
        filters: {},
        entries_per_page: partsPerPage,
        total_results: result.totalNumParts,
      };
      writeServerJsonResponse(res, part, result.statusCode);
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
}
