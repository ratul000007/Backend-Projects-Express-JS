const mongooose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongooose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
    },
});

//hash password before saving
userSchema.pre("save", async function (next) {
    //only hash if password is new or modified
    if(!this.isModified("password")) {
        return next();
    }

    try {
        //generate salt with 10 rounds
        const salt = await bcrypt.genSalt(10);
        //hash the password
        this.password = await bcrypt.salt(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongooose.model("User", userSchema);