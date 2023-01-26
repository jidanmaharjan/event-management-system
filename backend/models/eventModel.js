const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: Number,
    required: true,
    minlength: [10, "Contact Number must be minimum of 10 characters"],
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Auth",
  },
  eventStatus: {
    type: String,
    required: true,
    enum: {
      values: [
        "pending",
        "approved",
        "ongoing",
        "completed",
        "rejected",
        "cancelled",
      ],
    },
    default: "pending",
  },
  payment: {
    status: {
      type: String,
      required: true,
      enum: {
        values: ["unpaid", "paid", "advance"],
      },
      default: "unpaid",
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    details: {
      type: Object,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Event", eventSchema);
