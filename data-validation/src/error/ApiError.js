class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
  static badRequest(msg) {
    return new ApiError(400, msg);
  }
  static internal(msg) {
    return new ApiError(500, msg);
  }
  static conflict(msg) {
    return new ApiError(409, msg);
  }
}

export default ApiError;
