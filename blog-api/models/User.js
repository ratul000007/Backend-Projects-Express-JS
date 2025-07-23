const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["author", "reader"], default: "reader" },
}, { timestamps: true });

//hash passwrod before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//method to compare password
userSchema.methods.matchPassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
};

module.exports = mongoose.model("User", userSchema)