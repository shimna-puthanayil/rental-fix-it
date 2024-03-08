const { Schema, model } = require("mongoose");
const quoteSchema = require("./Quote");
const complaintSchema = new Schema({
  complaint: {
    type: String,
    required: true,
    trim: true,
  },
  property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    required: true,
    trim: true,
    default: "open",
  },
  quotes: [quoteSchema],
  approvedQuote: { type: String, default: "" },
  picUrl: [
    {
      type: String,
    },
  ],
});
const Complaint = new model("Complaint", complaintSchema);
module.exports = Complaint;
