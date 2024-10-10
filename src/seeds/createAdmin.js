const role = require("../lib/role");
const userService = require("../services/user.services");

const createAdmin = async () => {
  const user = await userService.createUser({
    email: "admin@email.com",
    firstName: "Admin",
    lastName: "User",
    password: "admin",
    isActive: true,
    role: role.Admin,
  });

  console.log("Created admin user", user.email);
};

createAdmin();
