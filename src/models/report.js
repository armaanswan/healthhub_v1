const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  reportType: { type: String, required: true },
  patientId: { type: String, required: true },
  reportData: { type: Object, required: true },
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
