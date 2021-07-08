const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    name:{
        type:String
    },
    description:{
        type:String
    },
    imageName:{
        type:String
    },
    status:{
        type:String
    }
});

const team = module.exports = mongoose.model('team', teamSchema);

module.exports.saveteam = function(team, callback){
    team.save(callback);
}

module.exports.updateteam = async function(conditions, update, options){
    try {
        let teamUpdate = await  team.updateOne(conditions, update, options);
        if (teamUpdate.n ===0) {
            return "No record Found"
        } else {
            return teamUpdate
        }

    } catch(err){
        throw err;
    }
   
    
}

module.exports.getAllteam = function(callback){
    team.find(callback);
   
}

module.exports.getTeamById = function(conditions, callback){
    team.find(conditions,callback);
}
module.exports.removeTeam = function(conditions, callback){
    team.deleteOne(conditions,callback);
}


