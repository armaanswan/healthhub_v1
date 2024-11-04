import { CanParams, AccessControlProvider } from "@refinedev/core";
import { USER_ROLE } from "./authProvider";
import { AccessControl } from "accesscontrol";

const ac = new AccessControl();

ac.grant("Admin")
  .create("users")
  .read("users")
  .update("users")
  .delete("users")
  .create("test-results")
  .read("test-results")
  .update("test-results")
  .delete("test-results");
ac.grant("Doctor").read("patients").update("patients").read("test-results");
ac.grant("Staff")
  .extend("Doctor")
  .create("test-results")
  .update("test-results");
ac.grant("Patient").read("test-results");
export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }: CanParams) => {
    let permission;
    const role = localStorage.getItem(USER_ROLE) || "";
    resource = resource || "";
    if (action === "show" && params?.own) {
      permission = ac.can(role).resource(resource).readOwn();
    } else if (action === "edit" && params?.own) {
      permission = ac.can(role).resource(resource).updateOwn();
    } else if (action === "list" || action === "show") {
      permission = ac.can(role).resource(resource).readAny();
    } else if (action === "create") {
      permission = ac.can(role).resource(resource).createAny();
    } else if (action === "edit") {
      permission = ac.can(role).resource(resource).updateAny();
    } else if (action === "delete") {
      permission = ac.can(role).resource(resource).deleteAny();
    }
    // console.log("can", resource, action, params);
    // console.log("permission", permission, permission?.granted);
    // console.log("role", role);

    return {
      can: permission?.granted || false,
      reason: permission?.granted ? "" : "Access denied",
    };
  },
};
