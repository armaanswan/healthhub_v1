const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  email: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  healthId: { type: String },
  dateOfBirth: { type: Date, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  role: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
});

schema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id, delete ret.password;
  },
});

module.exports = mongoose.model("User", schema);
