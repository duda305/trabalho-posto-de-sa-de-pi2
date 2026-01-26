import jwt from "jsonwebtoken";

function isAuthenticated(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: 401,
        message: "Token não fornecido",
      });
    }

    const [scheme, token] = authHeader.split(" ");

    if (!scheme || !token || scheme.toLowerCase() !== "bearer") {
      return res.status(401).json({
        status: 401,
        message: "Formato do token inválido",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    return next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Token inválido ou expirado",
    });
  }
}

export { isAuthenticated };
