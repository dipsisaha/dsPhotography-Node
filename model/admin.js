const mongoose = require('mongoose');
const adminSchema = mongoose.Schema({
    userName:{
        type:String
    },
    email:{
        type:String
    },
    fb:{
        type:String
    },
    insta:{
        type:String
    },
    password:{
        type:String
    },
    websiteName :{
        type:String
    }
});

const admin = module.exports = mongoose.model('admin', adminSchema);

module.exports.saveAdmin = function(admin, callback){
    admin.save(callback);
}

module.exports.updateAdmin = function(conditions, update, options,callback){
    admin.updateOne(conditions, update, options, callback);
}
