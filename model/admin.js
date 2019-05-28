const mongoose = require('mongoose');
const adminSchema = mongoose.Schema({
    userName:{
        type:String
    },
    password:{
        type:String
    }
});

const adminLoginDetails = module.exports = mongoose.model('adminLoginDetails', adminSchema);

module.exports.saveAdmin = function(adminLoginDetails, callback){
    adminLoginDetails.save(callback);
}