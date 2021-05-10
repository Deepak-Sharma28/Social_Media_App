const mongoose = require('mongoose');
const config = require('config');


const db = config.get("mongoURL");


const Connection = async() => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("database has connected successfully");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};


module.exports = Connection;