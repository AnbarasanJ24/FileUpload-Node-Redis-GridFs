
/* Core Dependency
=========================== */
const express = require('express');
const expbhs = require('express-handlebars');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const colors = require('colors');
const exphbs = require('express-handlebars');
const connectDB = require('./config/db');
const upload = require('./utility/upload');



/* Application Initialization
=========================== */
const app = express();




/* Config Variables
=========================== */
dotenv.config({ path: './config/config.env' });


/* Connecting to DB
=========================== */
connectDB();


/* View Engine Setup
=========================== */
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


/* Body Parser
=========================== */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/* Method Override
=========================== */
app.use(methodOverride('_method'));


/* Route Files
=========================== */
const fileUpload = require('./routes/fileUpload');


/* Mounting Router
=========================== */
app.use('/api/v1/', upload.single('file'), fileUpload)



/* Server Connection
=========================== */
const PORT = 5000;
app.listen(PORT, () => console.log("Server started!"))

