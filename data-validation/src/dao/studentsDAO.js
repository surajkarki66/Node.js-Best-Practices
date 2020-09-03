import { ObjectId } from "bson";

import logger from "../utils/logger";
const DEFAULT_SORT = [["name", 1]];
let students;
export default class StudentsDAO {
  static async injectDB(conn) {
    if (students) {
      return;
    }
    try {
      students = await conn.db(process.env.NS).collection("students");
      logger.info(
        `Connected to students collection of ${process.env.NS} database.`,
        "StudentsDAO.injectDB()"
      );
    } catch (e) {
      logger.error(
        `Error while injecting DB: ${e.message}`,
        "StudentsDAO.injectDB()"
      );
      throw e;
    }
  }
  static async create(studentInfo) {
    try {
      const result = await students.insertOne(studentInfo);
      return { data: { createdId: result.insertedId }, statusCode: 201 };
    } catch (e) {
      logger.error("Error occurred: " + e.message, "create()");
      throw e;
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
      logger.error(`Unable to issue find command, ${e.message}`);
      return {
        data: [],
        totalNumStudents: 0,
        statusCode: 404,
      };
    }
    const displayCursor = cursor
      .skip(parseInt(page) * parseInt(studentsPerPage))
      .limit(parseInt(studentsPerPage));
    try {
      const documents = await displayCursor.toArray();
      const totalNumStudents =
        parseInt(page) === 0 ? await students.countDocuments(query) : 0;
      return {
        data: documents,
        totalNumStudents,
        statusCode: documents.length > 0 ? 200 : 404,
      };
    } catch (e) {
      logger.error(
        `Unable to convert cursor to array or problem counting documents, ${e.message}`
      );
      throw e;
    }
  }
  static async getById(id) {
    let cursor;
    try {
      const query = { _id: ObjectId(id) };
      cursor = await students.find(query).sort(DEFAULT_SORT);
    } catch (e) {
      logger.error("Error occurred: " + e.message, "getById()");
      throw e;
    }
    try {
      const student = await cursor.toArray();
      if (student) {
        return { data: student, statusCode: 200 };
      } else {
        const message = "No document matching id: " + id + " could be found!";
        logger.error(message, "getById()");
        return { data: [], statusCode: 404 };
      }
    } catch (e) {
      logger.error(
        `Unable to convert cursor to array or problem counting documents, ${e.message}`,
        "getById()"
      );
      throw e;
    }
  }

  static async facetedSearch({
    filters = null,
    page = 0,
    studentsPerPage = 10,
  } = {}) {
    const matchStage = { $match: filters };
    const sortStage = { $sort: { name: 1 } };
    const countingPipeline = [matchStage, sortStage, { $count: "count" }];
    const skipStage = { $skip: parseInt(studentsPerPage) * parseInt(page) };
    const limitStage = { $limit: parseInt(studentsPerPage) };
    const facetStage = {
      $facet: {
        year: [
          {
            $bucketAuto: {
              groupBy: "$year",
              buckets: 10,
              output: {
                count: { $sum: 1 },
              },
            },
          },
        ],
        gpa: [
          {
            $bucketAuto: {
              groupBy: "$gpa",
              buckets: 3,
              output: {
                count: { $sum: 1 },
              },
            },
          },
        ],
        students: [
          {
            $addFields: {
              name: "$name",
            },
          },
        ],
      },
    };
    const queryPipeline = [
      matchStage,
      sortStage,
      skipStage,
      limitStage,
      facetStage,
    ];
    try {
      const results = await (await students.aggregate(queryPipeline)).next();
      const count = await (await students.aggregate(countingPipeline)).next();
      return {
        ...results,
        ...count,
        statusCode: 200,
      };
    } catch (e) {
      return { error: "Results too large, be more restrictive in filter" };
    }
  }
}
