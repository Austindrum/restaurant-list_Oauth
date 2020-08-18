const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/restaurant";
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const db = mongoose.connection;

db.on('error', ()=>{
    console.log("error");
})

db.once('open', ()=>{
    console.log("DB CONNECTION");
})

module.exports = db;