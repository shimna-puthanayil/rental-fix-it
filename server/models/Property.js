const { Schema, model } = require("mongoose");
const propertySchema = new Schema({
  address: { type: String, required: true, trim: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  agent: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tenant: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
const Property = new model("Property", propertySchema);
module.exports = Property;
