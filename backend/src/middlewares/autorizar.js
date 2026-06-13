/**
 * Middleware de autorización por rol.
 * @param {...string} roles - Roles permitidos para acceder a la ruta.
 */
const autorizar = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado.' });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: `Acceso denegado. Se requiere uno de los roles: ${roles.join(', ')}.`,
      });
    }

    next();
  };
};

module.exports = autorizar;
