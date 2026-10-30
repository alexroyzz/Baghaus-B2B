export const publicCache = (maxAgeSeconds) => (req, res, next) => {
  // Never cache admin responses or data requested with an authorization token.
  if (req.method !== "GET" || req.get("Authorization") || req.query.all === "true") {
    res.set("Cache-Control", "no-store");
    return next();
  }

  res.set(
    "Cache-Control",
    `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${maxAgeSeconds * 2}`
  );
  next();
};
