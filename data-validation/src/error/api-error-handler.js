import ApiError from "./ApiError";

function apiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    res.status(err.code).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: "Something went wrong." });
}

export default apiErrorHandler;
