const mongoose = require('mongoose');
const accountSchema = mongoose.Schema({
    id:{
        type:Number
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
    cvpic:{
        type:String
    },
    cvpic:{
        type:String
    },
    smallImgName :{
        type:String
    }
});

const account = module.exports = mongoose.model('account', accountSchema);

module.exports.saveAccount = function(account, callback){
    account.save(callback);
}

module.exports.updateAccount = function(conditions, update, options,callback){
    account.updateOne(conditions, update, options, callback);
}
