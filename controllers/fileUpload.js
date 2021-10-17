const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const dotenv = require('dotenv');
const photosApi = require('../utility/axios');
const redis = require('redis');


/* Redis client Initialization
=========================== */
let redisClient = redis.createClient();
redisClient.on('connect', () => {
    console.log("Connected to Redis")
})
const DEFAULT_EXPIRATION = 3600;


/* Config Variables
=========================== */
dotenv.config({ path: './config/config.env' });

// @desc      File Upload
// @route     POST '/api/v1/fileUpload
// @access    Public
exports.fileUpload = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: "File uploaded successful"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            data: "File not uploaded"
        })
    }

}

// @desc      Get All Files
// @route     POST '/api/v1/files'
// @access    Public
exports.getFiles = async (req, res, next) => {

    const conn = await mongoose.createConnection(process.env.MONGO_URI);

    let gfs;
    conn.once('open', async () => {
        gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection('events');

        await gfs.files.find().toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({
                    success: false,
                    data: files
                })
            }

            return res.status(200).json({
                success: true,
                data: files
            })

        })
    })

}

// @desc      Get All Photos
// @route     GET '/api/v1/photos
// @access    Public
exports.getPhotos = async (req, res, next) => {
    try {
        const albumId = req.query.albumId;

        const photos = await getOrSetCache(`photos?albumId=${albumId}`, async () => {
            const { data } = await photosApi.get('/photos', { params: { albumId } });
            return data;
        })

        res.status(200).json({
            success: true,
            data: photos
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            data: 'Server Error'
        })
    }

}


/* Get or Set Redis Data
=========================== */
const getOrSetCache = async (key, cb) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, async (error, data) => {
            if (error) reject(error);

            if (data) {
                return resolve(JSON.parse(data))
            }

            const uncachedData = await cb();
            redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(uncachedData));
            resolve(uncachedData);
        })
    })
}