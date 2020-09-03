import express from "express";
import createError from "http-errors";
import cookieParser from "cookie-parser";

// Create Express application
const app = express();

// Install Middleware
app.use(express.json());
app.use(cookieParser());

// Path routing

// Error handling
app.use(function (req, res, next) {
  // catch 404 and forward to error handler
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(5000, () => {
  console.log("Listening on PORT 5000");
});
