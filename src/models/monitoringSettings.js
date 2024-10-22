const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  monitoredFunction: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("MonitoringSettings", schema);
