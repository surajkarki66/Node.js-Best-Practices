import AccessControl from "accesscontrol";
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("basic").readOwn("accounts").updateOwn("accounts");

  ac.grant("supervisor").extend("basic").readAny("accounts");

  ac.grant("admin")
    .extend("basic")
    .extend("supervisor")
    .updateAny("accounts")
    .deleteAny("accounts");

  return ac;
})();
