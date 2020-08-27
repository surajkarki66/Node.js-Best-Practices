import express from "express";
import morgan from "morgan";

import Blog from "./api/blogRoute";
import Student from "./api/studentRoute";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/blog", Blog);
app.use("/api/student", Student);

export default app;
