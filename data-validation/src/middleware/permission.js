import roles from "../utils/roles";
import ApiError from "../error/ApiError";

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      console.log(req.user);
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        next(
          ApiError.unauthorized(
            "You don't have enough permission to perform this action"
          )
        );
        return;
      }
      next();
    } catch (error) {
      next(
        ApiError.unauthorized(
          "You don't have enough permission to perform this action"
        )
      );
      return;
    }
  };
};
export default grantAccess;
