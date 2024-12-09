import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
  const payload = {
    id,
    role,
  };
  if (!id) {
    throw new Error('user id is required to generate a token');
  }
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
};

export const verifyToken = (id, token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decodedToken.id !== id) {
      return {
        verified: false,
        error: 'Invalid User',
        message: 'User ID in the token does not match the provided user ID',
      };
    }

    return { verified: true, message: 'Token is valid', decodedToken };
  } catch (error) {
    // if (error instanceof jwt.TokenExpiredError)
    if (error.name === 'TokenExpiredError') {
      return {
        verified: false,
        error: 'TokenExpired',
        message: error.message,
      };
    } else if (error.name === 'JsonWebTokenError') {
      return {
        verified: false,
        error: 'InvalidToken',
        message: error.message,
      };
    }
  }
};
