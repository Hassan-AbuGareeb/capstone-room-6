const mongoose = require("mongoose");

const tokenBlackListSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now(), expires: 3600 },
});

module.exports = mongoose.model("tokenBlackList", tokenBlackListSchema);
