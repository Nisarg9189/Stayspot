const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { initialize } = require("passport");


main().then((res) => {
    console.log("connected to database");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68efb7ae4980a5880fce2116"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();