function writeServerJsonResponse(response, responseJson, statusCode) {
  response.setHeader("Content-Type", "application/json");
  response.status(statusCode).json(responseJson);
}

export default writeServerJsonResponse;
