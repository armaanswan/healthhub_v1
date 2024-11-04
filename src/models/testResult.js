const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  examType: { type: String, required: true },
  result: { type: Number },
  isAbnormal: { type: Boolean },
  isReady: { type: Boolean },
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
