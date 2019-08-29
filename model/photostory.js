const mongoose = require('mongoose');
const photoStorySchema = mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    status:{
        type:String
    }
});

const photostory = module.exports = mongoose.model('photostory', photoStorySchema);

module.exports.saveStory = function(photostory, callback){
    photostory.save(callback);
}

module.exports.updateStory = async function(conditions, update, options){
    
    try {
        let storyUpdate = await  photostory.updateOne(conditions, update, options);
        if (storyUpdate.n ===0) {
            return "No record Found"
        } else {
            return storyUpdate
        }

    } catch(err){
        throw err;
    }
   
    
}

module.exports.getAllStory = function(callback){
    photostory.find(callback);
   
}
module.exports.getStoryById = function(conditions, callback){
    photostory.find(conditions,callback);
}
module.exports.removeStory = function(conditions, callback){
    photostory.deleteOne(conditions,callback);
}

