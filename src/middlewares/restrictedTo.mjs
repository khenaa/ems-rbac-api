import { buildResponse } from '../utils/util.mjs';

export const restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return buildResponse(res, 403, {
        message:
          'ACCESS DENIED!!. You do not have permission to perform this action',
      });
    }
    next();
  };
};
