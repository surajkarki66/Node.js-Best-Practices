const { Forbidden } = require("../../common/utils/errors");

exports.noPermissionLevelRequired = (Not_required_permission_level) => {
  return (req, res, next) => {
    const user_permission_level = parseInt(req.jwt.permissionLevel);
    if (user_permission_level === Not_required_permission_level) {
      throw new Forbidden("Access Denied.");
    } else {
      return next();
    }
  };
};
