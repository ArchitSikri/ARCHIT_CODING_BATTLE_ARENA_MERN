const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preferredLanguage: { type: String, default: "cpp" , enum : ["cpp", "java", "python"]},
    socketId: { type: String, default: "" },
      pastRecords: [{
        battleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "battle"
        },
        score: {
            type: Number,
            default: 0
        },
        opponentScore: {
            type: Number,
            default: 0
        }
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);