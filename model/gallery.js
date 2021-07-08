const mongoose = require('mongoose');
const gallerySchema = mongoose.Schema({
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

const gallery = module.exports = mongoose.model('gallery', gallerySchema);

module.exports.savegallery = function(galleryArr, callback){
    gallery.insertMany(galleryArr,callback);
}

module.exports.getgalleryById = function(conditions, callback){
    gallery.find(conditions,callback);
}

module.exports.removegallery = function(conditions, callback){
    gallery.deleteOne(conditions,callback);
}
