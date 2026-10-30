export const requestTimeout = (timeoutMs) => (req, res, next) => {
  const timer = setTimeout(() => {
    req.timedOut = true;
    if (!res.headersSent && !res.destroyed) {
      res.status(504).json({ success: false, message: "Request timed out. Please try again." });
    }
  }, timeoutMs);

  const clearTimer = () => clearTimeout(timer);
  res.once("finish", clearTimer);
  res.once("close", clearTimer);
  next();
};
