const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config.js");
const db = require("../lib/db");
const User = db.User;

//this will authenticate the user credentials
async function login({ email, password }) {
  //find the user using email

  const user = await User.findOne({ email });
  //if user is truthy then sign the token
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ sub: user.id, role: user.role }, config.secret, {
      expiresIn: "7d",
    });
    return { ...user.toJSON(), token };
  }
}

//retrieving all users
async function getAllUsers(skip, limit, queryFilters) {
  const findQuery = queryFilters;

  const users = await User.find(findQuery)
    .skip(skip) // Skip the first `skip` users
    .limit(limit); // Limit the number of users returned to `limit`

  const totalUsers = await User.countDocuments(); // Get the total number of users for pagination metadata

  return {
    data: users,
    total: totalUsers,
  };
}
//retrieving user using id
async function getById(id) {
  return await User.findById(id);
}

//adding user to db
async function createUser(userParam) {
  //check if user exist
  const user = await User.findOne({ email: userParam.email });
  //validate
  if (user) throw `This email already exists: ${userParam.email}`;

  //create user obj
  const newUser = new User(userParam);
  if (userParam.password) {
    newUser.password = bcrypt.hashSync(userParam.password, 10);
  }

  await newUser.save();
  return newUser;
}

async function updateUser(id, userParam) {
  const user = await User.findById(id);
  //validate the id and email
  if (!user) throw "User not found.";
  if (
    user.email !== userParam.email &&
    (await User.findOne({ email: userParam.email }))
  ) {
    throw `User with email ${userParam.email} already exist.`;
  }

  //convert the password ot hash
  if (userParam.password) {
    userParam.password = bcrypt.hashSync(userParam.password, 10);
  }

  //copy the user obj
  Object.assign(user, userParam);
  await user.save();
  return user;
}

async function deleteUser(id) {
  await User.findByIdAndDelete(id);
}

module.exports = {
  login,
  getAllUsers,
  getById,
  createUser,
  updateUser,
  deleteUser,
};