const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  examDate: { type: Date, required: true },
  examType: { type: String, required: true },
  result: { type: Number, required: true },
  isAbnormal: { type: Boolean, required: true },
  createdDate: { type: Date, default: Date.now },
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("TestResult", schema);
