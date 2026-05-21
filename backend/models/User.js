const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    googleId: { type: String, index: true, sparse: true },
    targetRole: { type: String, default: "Frontend Developer" },
  },
  { timestamps: true }
);

userSchema.methods.toPublic = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    targetRole: this.targetRole,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
