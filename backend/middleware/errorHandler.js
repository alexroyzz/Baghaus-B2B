export const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const statusCode = err.statusCode || err.status || (err.name === "ValidationError" ? 400 : 500);
  if (statusCode >= 500) {
    console.error("Request failed:", { method: req.method, path: req.originalUrl, error: err.stack || err.message });
  }

  const safeMessage = statusCode >= 500
    ? "An unexpected server error occurred. Please try again later."
    : err.message || "Request failed";

  res.status(statusCode).json({
    success: false,
    message: safeMessage,
    ...(process.env.NODE_ENV === "development" && statusCode >= 500 && { stack: err.stack }),
  });
};
