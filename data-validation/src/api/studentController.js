import StudentsDAO from "../dao/studentsDAO";
import ApiError from "../error/ApiError";
import writeServerJsonResponse from "../utils/utils";
export default class StudentController {
  static async addStudent(req, res, next) {
    try {
      const student = req.body;
      const result = await StudentsDAO.create(student);
      if (result) {
        writeServerJsonResponse(res, result.data, result.statusCode);
      }
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
  static async listStudents(req, res, next) {
    try {
      const { page, studentsPerPage } = req.query;
      const result = await StudentsDAO.getStudents({
        page,
        studentsPerPage,
      });
      const student = {
        students: result.data,
        page: page,
        filters: {},
        entries_per_page: studentsPerPage,
        total_results: result.totalNumStudents,
      };
      writeServerJsonResponse(res, student, result.statusCode);
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
  static async searchStudents(req, res, next) {
    const { page, studentsPerPage } = req.query;
    let searchType;
    try {
      searchType = Object.keys(req.query)[0];
    } catch (error) {
      next(ApiError.internal(`No search keys specified: ${error.message}`));
      return;
    }
    let filters = {};
    switch (searchType) {
      case "name":
        if (req.query.name !== "") {
          filters.name = req.query.name;
        }
        break;
      case "year":
        if (req.query.year !== undefined) {
          filters.year = req.query.year;
        }
        break;
      case "street":
        if (req.query.street !== undefined) {
          filters.street = req.query.street;
        }
        break;
      case "city":
        if (req.query.city !== undefined) {
          filters.city = req.query.city;
        }
        break;
      default:
        break;
    }
    try {
      const result = await StudentsDAO.getStudents({
        filters,
        page,
        studentsPerPage,
      });

      const student = {
        students: result.data,
        page: page,
        filters,
        entries_per_page: studentsPerPage,
        total_results: result.totalNumStudents,
      };
      writeServerJsonResponse(res, student, result.statusCode);
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
  static async getStudentsById(req, res, next) {
    const id = req.params.id;
    try {
      const result = await StudentsDAO.getById(id);
      if (result) {
        writeServerJsonResponse(res, result.data[0], result.statusCode);
      }
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
  static async studentsFacetedSearch(req, res, next) {
    try {
      const { page, studentsPerPage, major } = req.query;

      const filters = { major: major };

      const facetedSearchResult = await StudentsDAO.facetedSearch({
        filters,
        page,
        studentsPerPage,
      });
      const students = {
        students: facetedSearchResult.students,
        facets: {
          year: facetedSearchResult.year,
          gpa: facetedSearchResult.gpa,
        },
        page: page,
        filters,
        entries_per_page: studentsPerPage,
        total_results: facetedSearchResult.count,
      };

      writeServerJsonResponse(res, students, facetedSearchResult.statusCode);
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
}
