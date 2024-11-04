const { expressjwt } = require("express-jwt");
const config = require("../config.js");
const db = require("../lib/db");

function fromCookie(req) {
  return req.cookies.jwt;
}

function jwt(roles = [], credentialsRequired = true) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }
  const secret = config.secret;
  return [
    // authenticate JWT token and attach user to request object (req.auth)
    expressjwt({
      secret,
      algorithms: ["HS256"],
      getToken: fromCookie,
      credentialsRequired,
    }),

    // authorize based on user role
    async (req, res, next) => {
      const user = await db.User.findById(req.auth.sub);

      if (!user || (roles.length && !roles.includes(user.role))) {
        // user's role is not authorized
        return res.status(401).json({ message: "Only Admin is Authorized!" });
      }
      // authentication and authorization successful
      req.auth.role = user.role;
      next();
    },
  ];
}
module.exports = jwt;
