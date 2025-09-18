import jwt from 'jsonwebtoken';

function isAuthenticated(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ auth: false, message: 'Token não fornecido.' });
    }

    const parts = authorization.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ auth: false, message: 'Formato do token inválido.' });
    }

    const token = parts[1];

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = userId;

    next();
  } catch (error) {
    return res.status(401).json({ auth: false, message: 'Token inválido.' });
  }
}

export { isAuthenticated };
