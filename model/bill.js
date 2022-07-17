const mongoose = require("mongoose");

//Schema for user table
const billSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    productDetails: {
      type: Object,
    },
    total: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bill", billSchema);
