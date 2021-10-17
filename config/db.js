const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const connectDB = async () => {
    const conn = await mongoose.createConnection(process.env.MONGO_URI);

    let gfs;
    conn.once('open', () => {
        gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection('events');
    })
    console.log(conn.states.connected)

    console.log(conn.states.connected ? `MongoDB connected`.yellow.underline : null);
    return conn;
}

module.exports = connectDB;