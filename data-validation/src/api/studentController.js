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
}
