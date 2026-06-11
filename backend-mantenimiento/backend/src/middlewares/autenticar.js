const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación JWT.
 * Verifica que la solicitud incluya un token válido en el header Authorization.
 * Si el token es válido, adjunta el payload del usuario a req.usuario y llama a next().
 * Si no, responde con 401.
 */

const autenticar = (req, res, next) => {
  // Se espera el header con formato: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  // Si no existe el header o no tiene el formato correcto, se rechaza la solicitud
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado. Autenticación requerida.' });
  }
  
  // Se extrae el token eliminando el prefijo "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    // Se verifica la firma del token con el secreto definido en variables de entorno
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Se adjunta el payload decodificado a req.usuario para uso en middlewares siguientes
    // Contiene: { id, email, rol, nombre }
    req.usuario = payload; 
    next();
  } catch (err) {
    // Token expirado, firma inválida o malformado
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

module.exports = autenticar;
