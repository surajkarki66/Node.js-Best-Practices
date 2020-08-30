import { ObjectId } from "bson";
let students;
const DEFAULT_SORT = [["name", 1]];
export default class StudentsDAO {
  static async injectDB(conn) {
    if (students) {
      return;
    }
    try {
      students = await conn.db(process.env.NS).collection("students");
    } catch (e) {
      console.error(
        `Unable to establish collection handles in studentDAO: ${e}`
      );
    }
  }
  static async addStudent(studentInfo) {
    try {
      await students.insertOne(studentInfo);
      return { success: true };
    } catch (e) {
      return { error: e };
    }
  }
  static textSearchQuery(text) {
    const query = { $text: { $search: text } };
    const sort = [["name", 1]];
    const project = {};
    return { query, project, sort };
  }
  static yearSearchQuery(year) {
    const query = { year: parseInt(year) };
    const sort = [["name", 1]];
    const project = {};
    return { query, project, sort };
  }
  static streetSearchQuery(street) {
    const query = { "address.street": street };
    const sort = [["name", 1]];
    const project = {};
    return { query, project, sort };
  }
  static citySearchQuery(city) {
    const query = { "address.city": city };
    const sort = [["name", 1]];
    const project = {};
    return { query, project, sort };
  }

  static async getStudents({
    filters = null,
    page = 0,
    studentsPerPage = 10,
  } = {}) {
    let queryParams = {};
    if (filters) {
      if ("name" in filters) {
        queryParams = this.textSearchQuery(filters["name"]);
      } else if ("year" in filters) {
        queryParams = this.yearSearchQuery(filters["year"]);
      } else if ("street" in filters) {
        queryParams = this.streetSearchQuery(filters["street"]);
      } else if ("city" in filters) {
        queryParams = this.citySearchQuery(filters["city"]);
      }
    }
    let { query = {}, project = {}, sort = DEFAULT_SORT } = queryParams;
    let cursor;
    try {
      cursor = await students.find(query).project(project).sort(sort);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { studentsList: [], totalNumStudents: 0 };
    }
    const displayCursor = cursor
      .skip(parseInt(page) * parseInt(studentsPerPage))
      .limit(parseInt(studentsPerPage));
    try {
      const studentsList = await displayCursor.toArray();
      const totalNumStudents =
        parseInt(page) === 0 ? await students.countDocuments(query) : 0;
      return { studentsList, totalNumStudents };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { studentsList: [], totalNumStudents: 0 };
    }
  }
}
