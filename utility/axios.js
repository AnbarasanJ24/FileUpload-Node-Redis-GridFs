const axios = require("axios");

const photosApi = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',

})

module.exports = photosApi;