import StudentsDAO from "../dao/studentsDAO";
export default class StudentController {
  static async create(req, res) {
    try {
      const student = req.body;
      const data = await StudentsDAO.addStudent(student);
      if (data.success) {
        res.status(201).json({ success: true });
      }
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
  static async listStudents(req, res) {
    const { page, studentsPerPage } = req.query;
    const { studentsList, totalNumStudents } = await StudentsDAO.getStudents({
      page,
      studentsPerPage,
    });
    let response = {
      students: studentsList,
      page: page,
      filters: {},
      entries_per_page: studentsPerPage,
      total_results: totalNumStudents,
    };
    res.json(response);
  }
  static async searchStudents(req, res) {
    const { page, studentsPerPage } = req.query;
    let searchType;
    try {
      searchType = Object.keys(req.query)[0];
    } catch (error) {
      console.error(`No search keys specified: ${error}`);
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
      res.status(500).json(e);
    }
  }
  static async getStudentsById(req, res) {
    const id = req.params.id;
    try {
      const response = await StudentsDAO.getById(id);
      if (response) {
        const student = response[0];
        res.status(200).json(student);
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
