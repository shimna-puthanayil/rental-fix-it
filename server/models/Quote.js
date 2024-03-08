const { Schema } = require("mongoose");

// This is a sub document schema, it won't become its own model but we'll use it as the schema for the Complaints's `quotes` array in Complaint.js
const quoteSchema = new Schema({
  businessName: {
    type: String,
  },
  address: {
    type: String,
  },
  quote: {
    type: String,
  },
});

module.exports = quoteSchema;
