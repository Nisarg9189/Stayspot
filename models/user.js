const { required } = require("joi");
const mongoose = require("mongoose");
const passwordLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
});

userSchema.plugin(passwordLocalMongoose); // automatically add username, password, hashing, salting in schema

module.exports = mongoose.model("User", userSchema);