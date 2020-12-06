const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    number: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("bulkUpsert", schema);
