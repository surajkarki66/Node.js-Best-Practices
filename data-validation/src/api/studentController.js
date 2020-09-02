import StudentsDAO from "../dao/studentsDAO";
import ApiError from "../error/ApiError";
export default class StudentController {
  static async addStudent(req, res, next) {
    try {
      const student = req.body;
      const data = await StudentsDAO.create(student);
      if (data.success) {
        res.status(201).json({ success: true, data });
      }
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
  static async listStudents(req, res, next) {
    try {
      const { page, studentsPerPage } = req.query;
      const { studentsList, totalNumStudents } = await StudentsDAO.getStudents({
        page,
        studentsPerPage,
      });
      const response = {
        students: studentsList,
        page: page,
        filters: {},
        entries_per_page: studentsPerPage,
        total_results: totalNumStudents,
      };
      return res.json(response);
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
      const { studentsList, totalNumStudents } = await StudentsDAO.getStudents({
        filters,
        page,
        studentsPerPage,
      });

      const response = {
        students: studentsList,
        page: page,
        filters,
        entries_per_page: studentsPerPage,
        total_results: totalNumStudents,
      };
      res.status(200).json(response);
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
  static async getStudentsById(req, res, next) {
    const id = req.params.id;
    try {
      const response = await StudentsDAO.getById(id);
      if (response) {
        const student = response[0];
        res.status(200).json(student);
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
      const response = {
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

      res.status(200).json(response);
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
}
