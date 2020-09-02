import express from "express";
import morgan from "morgan";

import Blog from "./api/blogRoute";
import Student from "./api/studentRoute";
import User from "./api/userRoute";
import Part from "./api/partRoute";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/blog", Blog);
app.use("/api/student", Student);
app.use("/api/user", User);
app.use("/api/part", Part);

export default app;
