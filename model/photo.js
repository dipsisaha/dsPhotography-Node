const mongoose = require('mongoose');
const photoSchema = mongoose.Schema({
    storyid:{
        type:String
    },
    imageName:{
        type:String
    },
    midImageName:{
        type:String
    },
    smallImageName:{
        type:String
    },
    status:{
        type:String
    }
});

const photo = module.exports = mongoose.model('photo', photoSchema);

module.exports.savePhoto = function(photoArr, callback){
    photo.insertMany(photoArr,callback);
}

module.exports.getPhotoById = function(conditions, callback){
    photo.find(conditions,callback);
}

module.exports.removePhoto = function(conditions, callback){
    photo.deleteOne(conditions,callback);
}

module.exports.removeAllPhotoByStoryId = function(conditions, callback){
    photo.deleteMany(conditions,callback);
}