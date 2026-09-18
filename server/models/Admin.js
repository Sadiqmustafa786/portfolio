const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false, // Password query mein show nahi hoga by default
  },
  cv: {
    filename: { type: String, default: null },
    originalName: { type: String, default: null },
    uploadedAt: { type: Date, default: null },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Password ko hash karein before saving.
// NOTE: This is a pure async/await (promise-based) hook with NO `next`
// parameter. Mixing `async function(next)` with manual next() calls is
// what caused "next is not a function" - Mongoose only expects ONE
// completion signal (either call next(), or return/throw from an async
// function), never both styles in the same hook.
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password match karne ka method
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);