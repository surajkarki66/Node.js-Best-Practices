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
}
