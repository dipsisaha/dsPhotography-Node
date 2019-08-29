const mongoose = require('mongoose');

const cmsSchema = mongoose.Schema({
    cms_type:{
        type:String
    },
    description:{
        type:String
    }
});

const cms = module.exports = mongoose.model('cms', cmsSchema);

module.exports.saveCms = function(cms, callback){
    cms.save(callback);
}

module.exports.updateCms = async function(conditions, update, options){
    // cms.updateOne(conditions, update, options, callback);
    
    // const promiseHandler = new Promise((resolve, reject) => {
    //     cms.updateOne(conditions, update, options).then((docs)=>{
    //         if(docs) {
    //             docs.n !== 0?resolve({success:true,data:docs}):reject({success:false,data:"no such type exist"});
    //         } else {
    //             reject({success:false,data:"no such type exist"});
    //         }
    //     }).catch((err)=>{
    //     reject(err);
    //     })
    // });
    // return promiseHandler;
    try {
        let cmsUpdate = await  cms.updateOne(conditions, update, options);
        if (cmsUpdate.n ===0) {
            return "No record Found"
        } else {
            return cmsUpdate
        }

    } catch(err){
        throw err;
    }
   
    
}

module.exports.getAllCms = function(callback){
    cms.find(callback);
   
}
module.exports.getCmsByType = function(conditions, callback){
    cms.find(conditions,callback);
}

