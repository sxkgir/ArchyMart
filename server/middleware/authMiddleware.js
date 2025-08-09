

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.session.isVerified) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized. Please log in and verify your email." });
}

module.exports = { ensureAuthenticated };