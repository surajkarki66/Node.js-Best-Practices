import express from "express";
import morgan from "morgan";

import Blog from "./api/blogRoute";
import Student from "./api/studentRoute";
import User from "./api/userRoute";
import Part from "./api/partRoute";
import Product from "./api/productRoute";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/blog", Blog);
app.use("/api/student", Student);
app.use("/api/user", User);
app.use("/api/part", Part);
app.use("/api/product", Product);

export default app;
