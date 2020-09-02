import PartsDAO from "../dao/partsDAO";
export default class PartController {
  static async addPart(req, res) {
    try {
      const part = req.body;
      const data = await PartsDAO.create(part);
      if (data.success) {
        res.status(201).json({ success: true });
      }
    } catch (e) {
      res.status(500).json({ error: e });
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
      res.json(response);
    } catch (e) {
      console.log(e);
    }
  }
}
