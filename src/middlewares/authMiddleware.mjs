import jwt from 'jsonwebtoken';
import { buildResponse } from '../utils/util.mjs';

export const authMiddleware = (req, res, next) => {
  // check that the Authorization header is set
  const authorizationToken = req.headers.authorization;
  if (!authorizationToken) {
    return buildResponse(res, 400, {
      message: 'Bad request. Header does not contain authorization token',
    });
  }

  // validates the word bearer is in the token
  if (!authorizationToken.toLowerCase().startsWith('bearer ')) {
    return buildResponse(res, 400, {
      message: "Invalid Token. The token should begin with 'Bearer '",
    });
  }

  try {
    // extracts token by removing bearer
    const token = authorizationToken.split(' ')[1];

    // decode token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // confirm that decodedToken has required keys
    if (!decodedToken.id) {
      return buildResponse(res, 401, {
        message: 'Unauthorized. The authorization token supplied is invalid',
      });
    } else {
      // set current user in Express request object
      req.currentUser = decodedToken;

      // now proceed to the next middleware or route handler
      next();
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return buildResponse(res, 401, {
        message: 'The authorization token supplied is expired',
      });
    } else {
      return buildResponse(res, 401, {
        message: 'The authorization token supplied is invalid',
      });
    }
  }
};
