var http            = require("http");
var express			= require("express");
var app				= express()

const path          = require('path');
const bodyParser    = require('body-parser');
const cors          = require('cors');
var mongoose 	    = require('mongoose');
const api           = require('./routes/api');
const config        = require('./config/config');

//var MongoClient     = require('mongodb').MongoClient;
var Mongo     = require('mongodb');
const fs		  = require('fs');
var log4js    = require('log4js');
var logger = log4js.getLogger('DSPhotography');

var host = 'localhost';
var port = 3000;

/****** MONGO DB COLLECTION ***** */
// var url = "mongodb://localhost:27017/DSphotography";

// MongoClient.connect(url, function(err, db) {

//     if (err) throw err;
//     console.log("Database created!");
//     db.close();
// }); 

mongoose.Promise = global.Promise;

var mongoConnectStr = "mongodb+srv://";
if(config.dbUsername != null) {
	mongoConnectStr += config.dbUsername;
}
if(config.dbPassword != null) {
	mongoConnectStr += ":"+config.dbPassword+"@";
}
//mongoConnectStr += config.host + ":"+config.port+"/"+config.dbName;

mongoConnectStr += config.host + "/"+config.dbName;

mongoose.connect(mongoConnectStr,{
	useNewUrlParser: true
});



app.use(cors());
app.use('/files', express.static( __dirname + '/uploads'));

// new folder
app.use('/static', express.static(path.join(__dirname, 'public')))

/* **** POST COFIGURATION **** */
app.use( bodyParser.json({limit: '1048576mb'}) );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({ extended: false,
    parameterLimit: 1000000,
	limit: '50mb'}));
	const DIR = './uploads';

	// let storage = multer.diskStorage({
	// 	destination: (req, file, cb) => {
	// 	  cb(null, DIR);
	// 	},
	// 	filename: (req, file, cb) => {
	// 		console.log(file)
	// 	  cb(null, file.fieldname + '-' + Date.now() + '-' + path.extname(file.originalname));
	// 	},
	// 	limits: 5
	// });
	// let upload = multer({storage: storage});

app.use('/api', api);


app.listen(port,  function () {
    console.log(__dirname)

        if (!fs.existsSync(DIR)){
            fs.mkdirSync(DIR);
        }


 });

 logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************', host, port);
