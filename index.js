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

/****** MONGO DB COLLECTION ***** */
// var url = "mongodb://localhost:27017/DSphotography";

// MongoClient.connect(url, function(err, db) {

//     if (err) throw err;
//     console.log("Database created!");
//     db.close();
// }); 

mongoose.Promise = global.Promise;

var mongoConnectStr = "mongodb://";
if(config.dbUsername != null) {
	mongoConnectStr += config.dbUsername;
}
if(config.dbPassword != null) {
	mongoConnectStr += ":"+config.dbPassword+"@";
}
mongoConnectStr += config.host + ":"+config.port+"/"+config.dbName;

mongoose.connect(mongoConnectStr,{
	useNewUrlParser: true
});



app.use(cors());

// new folder
app.use('/static', express.static(path.join(__dirname, 'public')))

/* **** POST COFIGURATION **** */
app.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({ extended: false,
    parameterLimit: 1000000,
	limit: '50mb'}));

app.use('/api', api);


app.listen(3000, () =>	console.log("Server Started"));
