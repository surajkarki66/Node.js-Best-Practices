import express from "express";
import morgan from "morgan";

import Blog from "./api/blogRoute";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/blog", Blog);

export default app;
