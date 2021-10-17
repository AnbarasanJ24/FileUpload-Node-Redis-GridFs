const express = require('express');
const router = express.Router();

const { fileUpload, getFiles, getPhotos } = require('../controllers/fileUpload');

router.route('/fileUpload').post(fileUpload);
router.route('/files').post(getFiles);
router.route('/photos').post(getPhotos);


module.exports = router;