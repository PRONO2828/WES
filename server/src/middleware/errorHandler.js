export function errorHandler(error, req, res, next) {
  const statusCode = Number(error.statusCode || 500);
  const message = error.message || "Internal server error";

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    message
  });
}
