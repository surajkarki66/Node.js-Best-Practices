let blogs;

export default class BlogsDAO {
  static async injectDB(conn) {
    if (blogs) {
      return;
    }
    try {
      blogs = await conn.db(process.env.NS).collection("blogs");
    } catch (e) {
      console.error(`Unable to establish collection handles in blogDAO: ${e}`);
    }
  }

  static async addBlog(blogInfo) {
    try {
      await blogs.insertOne(blogInfo);
      return { success: true };
    } catch (e) {
      return { error: e };
    }
  }
}
