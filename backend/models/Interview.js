const mongoose = require("mongoose");

const turnSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true },
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    askedAt: { type: Date, default: Date.now },
    answeredAt: { type: Date },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: { type: String, required: true },           // e.g. "Frontend Engineer"
    type: { type: String, required: true },           // technical | system | behavioral
    duration: { type: Number, required: true },       // minutes
    difficulty: { type: String, required: true },     // junior | mid | senior
    totalQuestions: { type: Number, default: 6 },
    turns: { type: [turnSchema], default: [] },
    status: {
      type: String,
      enum: ["in_progress", "completed", "abandoned"],
      default: "in_progress",
      index: true,
    },
    review: {
      overall: Number,
      clarity: Number,
      confidence: Number,
      technical: Number,
      summary: String,
      strengths: [{ title: String, note: String }],
      improvements: [{ title: String, note: String, tip: String }],
      keywords: [String],
      perTurn: [
        {
          index: Number,
          tone: { type: String, enum: ["strong", "feedback"] },
          feedback: String,
        },
      ],
    },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
