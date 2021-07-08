/*
 *
 *  * *
 *  *  * Copyright (c) 2018 IBM. All Rights Reserved.
 *  *  *
 *  *  * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 *  *  * use this file except in compliance with the License. You may obtain a copy of
 *  *  * the License at
 *  *  *
 *  *  * http://www.apache.org/licenses/LICENSE-2.0
 *  *  *
 *  *  * Unless required by applicable law or agreed to in writing, software
 *  *  * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 *  *  * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  *  * License for the specific language governing permissions and limitations under
 *  *  * the License.
 *  *  *
 *
 */

/*
 * Project Name : Dipanwita-NodeJS
 * Created by Dipanwita Saha on 07/03/19
 * EMAIL: dipanwis@in.ibm.com
 */

'use strict'
const express = require('express');
const router = express.Router();
var path = require('path');
var util = require('util');
var os = require('os');
const adminLogin = require('../model/admin');
const cms = require('../model/cms');
const story = require('../model/photostory');
const photo = require('../model/photo');
const gallery = require('../model/gallery');
const account = require('../model/account');
const team = require('../model/team');

const passport = require('passport');
var request = require('request');
const mime = require('mime');

const Jimp = require('jimp');
const sharp = require('sharp');


var async = require('async');
const fs		  = require('fs');
const DIR = './uploads';

router.post('/insertAdminDetails', (req, res,next)=> {
    console.log("=============")
   let adminLoginDetails = new adminLogin({
    userName : req.body.username,
    password : req.body.password
   })
   
   console.log(adminLoginDetails)
   adminLogin.saveAdmin(adminLoginDetails,(err, adminLogin) =>{
    if(err){
        res.json({success:false, msg:"Failed to register admin Contact"});
    }else{
        res.json({success:true, msg:adminLoginDetails});
    }
   })

});

router.post('/login', (req, res, next) =>{
    var userName = req.body.userName;
    var password = req.body.password;
 
    console.log("userName---",userName)
    console.log("password---",password)
 
    adminLogin.findOne({userName : userName, password : password}, function(err, user){
        if(err){
            console.log(err);
            return res.status(500).send({"status":"500", "msg":"Login Unsuccessful"});
        }
        if (!user){
            return res.status(404).send({"status":"404", "msg":"Invalid Credentials"});
        }
 
        res.status(200).send({"status":"200", "msg":"Login successful","value":user});
    })

 })

 router.post('/getAdminDetails', (req, res, next) =>{
    var id = req.body.id;
   
 console.log(id)
    adminLogin.findOne({_id : id}, function(err, user){
        if(err){
            console.log(err);
            return res.status(500).send({"status":"500", "msg":"Unsuccessful"});
        }
        if (!user){
            return res.status(404).send({"status":"404", "msg":"Invalid Id"});
        }
 
        res.status(200).send({"status":"200","value":user});
    })

 })

 router.post('/updateAdminDetails', (req, res, next) =>{
    var userName = req.body.userName;
    var password = req.body.password;
    var email = req.body.email;
    var fb = req.body.fb;
    var insta = req.body.insta;
    var websiteName = req.body.websiteName;
    var id = req.body.id;

    var conditions = { _id: id };
    var update = { $set: { userName: userName,email: email, password: password,fb: fb,insta: insta,websiteName:websiteName  } };
    var options = { multi: true ,new:true};
 
  
 
    adminLogin.updateAdmin(conditions,update,options,(err, adminLogin) =>{
        if(err){
            res.json({success:false, msg:"Failed to Update Details"});
        }else{
            res.json({success:true, msg:adminLogin});
        }
    })

 })

 // Account setting //

 router.post('/insertAccountDetails', async (req, res,next)=> {

    var decodedImg,image,extension,midImgName,smallImgName

    if(req.body.fileSource) {
        await req.body.fileSource.forEach(async element => {

            decodedImg = await decodeBase64Image(element);
            image = decodedImg.split(".")
            extension = image[1]
            imgName = image[0]
            midImgName = imgName+"_M"+"."+extension
            smallImgName = imgName+"_S"+"."+extension
     
                 
     
             Jimp.read(DIR+"/"+decodedImg)
                 .then(lenna => {
                     var height = lenna.bitmap.height
                     var width = lenna.bitmap.width
     
                     var reSizeH = Jimp.AUTO
                     var reSizeW = 1500
                     if(height > width) {
                         reSizeH = 1500
                         reSizeW = Jimp.AUTO
                     } 
     
                     return lenna
                     .resize(reSizeW, reSizeH) // resize
                     .quality(72) // set JPEG quality
                     .write(DIR+"/"+midImgName); // save
                 })
                 .catch(err => {
                     console.error(err);
                 });
     
             Jimp.read(DIR+"/"+decodedImg)
             .then(lenna => {
     
                 var height = lenna.bitmap.height
                 var width = lenna.bitmap.width
     
                 var reSizeH = Jimp.AUTO
                 var reSizeW = 150
                 if(height > width) {
                     reSizeH = 150
                     reSizeW = Jimp.AUTO
                 } 
                 return lenna
                 .resize(reSizeW, reSizeH) // resize
                 .quality(72) // set JPEG quality
                 .write(DIR+"/"+smallImgName); // save
             })
             .catch(err => {
                 console.error(err);
             });
     
            console.log("decodedImg",decodedImg)
             
         });
    }

   

    let accountDetails = new account({
        email : req.body.email,
        fb : req.body.fb,
        insta : req.body.insta,
        websiteName : req.body.websiteName,
        cvpic:decodedImg,
        smallImageName : smallImgName,
        id:1
    })
    
    console.log(accountDetails)
    account.saveAccount(accountDetails,(err, account) =>{
     if(err){
         res.json({success:false, msg:"Failed to register Account Settings"});
     }else{
         res.json({success:true, msg:account});
     }
    })
 
 });

 router.post('/getAccountDetails', (req, res, next) =>{
    var id = req.body.id;
   
 console.log(id)
 account.findOne({id : id}, function(err, user){
        if(err){
            console.log(err);
            return res.status(500).send({"status":"500", "msg":"Unsuccessful"});
        }
        if (!user){
            return res.status(404).send({"status":"404", "msg":"Invalid Id"});
        }
 
        res.status(200).send({"status":"200","value":user});
    })

 })

 router.post('/updateAccountDetails', async (req, res, next) =>{
    var email = req.body.email;
    var fb = req.body.fb;
    var insta = req.body.insta;
    var websiteName = req.body.websiteName;
    var id = req.body.id;
    var decodedImg = req.body.cvpic;
    var smallImgName = req.body.smallImgName;

    var image,extension
    if(req.body.fileSource) {

        try {
            fs.unlinkSync(DIR+"/"+smallImgName)
            //file removed
          } catch(err) {
            console.error(err)
          }
          try {
            fs.unlinkSync(DIR+"/"+decodedImg)
            //file removed
          } catch(err) {
            console.error(err)
          }

        await req.body.fileSource.forEach(async element => {

            decodedImg = await decodeBase64Image(element);
            image = decodedImg.split(".")
            extension = image[1]
            imgName = image[0]
            smallImgName = imgName+"_S"+"."+extension
     
                 
     
     
             Jimp.read(DIR+"/"+decodedImg)
             .then(lenna => {
     
                 var height = lenna.bitmap.height
                 var width = lenna.bitmap.width
     
                 var reSizeH = Jimp.AUTO
                 var reSizeW = 150
                 if(height > width) {
                     reSizeH = 150
                     reSizeW = Jimp.AUTO
                 } 
                 return lenna
                 .resize(reSizeW, reSizeH) // resize
                 .quality(72) // set JPEG quality
                 .write(DIR+"/"+smallImgName); // save
             })
             .catch(err => {
                 console.error(err);
             });
     
            console.log("decodedImg",decodedImg)
             
         });
    }


    var conditions = { id: id };
    var update = { $set: { email: email, fb: fb,insta: insta,websiteName:websiteName, cvpic:decodedImg,smallImageName : smallImgName} };
    var options = { multi: true ,new:true};
 
  
 
    account.updateAccount(conditions,update,options,(err, account) =>{
        if(err){
            res.json({success:false, msg:"Failed to Update Details"});
        }else{
            res.json({success:true, msg:account});
        }
    })

 })


 router.post('/removeCvPhoto', (req, res, next) =>{
    var id = req.body.id;
    var decodedImg = req.body.cvpic;
    var smallImgName = req.body.smallImgName;

    var image,extension

        try {
            fs.unlinkSync(DIR+"/"+smallImgName)
            //file removed
          } catch(err) {
            console.error(err)
          }
          try {
            fs.unlinkSync(DIR+"/"+decodedImg)
            //file removed
          } catch(err) {
            console.error(err)
          }

    


    var conditions = { id: id };
    var update = { $set: { cvpic:"",smallImageName : ""} };
    var options = { multi: true ,new:true};
 
  
 
    account.updateAccount(conditions,update,options,(err, account) =>{
        if(err){
            res.json({success:false, msg:"Failed to Update Details"});
        }else{
            res.json({success:true, msg:account});
        }
    })

 })

 // CMS Settings//

 router.post('/insertCmsDetails', (req, res,next)=> {
    let cmsDetails = new cms({
    cms_type : req.body.type,
    description : req.body.description
    })
    
    console.log(cmsDetails)
    cms.saveCms(cmsDetails,(err, cms) =>{
     if(err){
         res.json({success:false, msg:"Failed to insert cms record."});
     }else{
         res.json({success:true, msg:cmsDetails});
     }
    })
 
 });

 router.post('/updateCms', async (req, res, next) =>{
    var cms_type = req.body.cmsType;
    var description = req.body.description;

    var conditions = { cms_type: cms_type };
    var update = { $set: { cms_type: cms_type, description: description } };
    var options = { multi: true ,new:true};
 
    console.log("cms_type---",cms_type)
    console.log("description---",description)
 
    // cms.updateCms(conditions,update,options,(err, cms) =>{
       /*  cms.updateCms(conditions,update,options)
        .then(result => {
            res.json(result);
        })
        .catch(error => {            
            res.json(error);
        }) */
    try{
        let output = await cms.updateCms(conditions,update,options);
       res.json(output);
    }
    catch(error){
        res.json(error);
    }
    
 })


 router.get('/getAllCms', (req, res,next)=> {
    cms.getAllCms((err, result) =>{
     if(err){
         res.json({success:false, msg:"Failed to insert cms record."});
     }else{
         res.json({success:true, msg:result});
     }
    })
 
 });

 router.post('/getCmsByType', (req, res,next)=> {
    var cms_type = req.body.cmsType;

    var conditions = { cms_type: cms_type };

    cms.getCmsByType(conditions,(err, cms) =>{
     if(err){
         res.json({success:false, msg:"Failed to get cms record."});
     }else{
         res.json({success:true, msg:cms});
     }
    })
 
 });
  
 // Photo story API 
 router.post('/insertStoryDetails', (req, res,next)=> {
    let storyDetails = new story({
    title : req.body.title,
    description : req.body.description,
    status: req.body.status
    })
    
    console.log(storyDetails)
    story.saveStory(storyDetails,(err, cms) =>{
     if(err){
         res.json({success:false, msg:"Failed to insert story record."});
     }else{
         res.json({success:true, msg:storyDetails});
     }
    })
 
 });

 router.post('/updateStory', async (req, res, next) =>{
    var title = req.body.title;
    var description = req.body.description;
    var id = req.body.id;
    var status = req.body.status;

    var conditions = { _id: id };
    var update = { $set: { title: title, description: description,status: status } };
    var options = { multi: true ,new:true};
 
    console.log("title---",title)
    console.log("description---",description)
 
    try{
        let output = await story.updateStory(conditions,update,options);
       res.json(output);
    }
    catch(error){
        res.json(error);
    }
    
 })


 router.get('/getAllStory', (req, res,next)=> {
    story.getAllStory((err, result) =>{
     if(err){
         res.json({success:false, msg:"Failed to insert story record."});
     }else{
         res.json({success:true, msg:result});
     }
    })
 
 });

 router.post('/getStoryById', (req, res,next)=> {
    var id = req.body.id;

    var conditions = { _id: id };


    story.getStoryById(conditions,(err, story) =>{
     if(err){
         res.json({success:false, msg:"Failed to get story record."});
     }else{
         res.json({success:true, msg:story});
     }
    })
 
 });

//  router.post('/removeStoryById', (req, res,next)=> {
//     var id = req.body.id;

//     var conditions = { _id: id };


//     story.removeStory(conditions,(err, story) =>{
//      if(err){
//          res.json({success:false, msg:"Failed to get story record."});
//      }else{
//          res.json({success:true, msg:story});
//      }
//     })
 
//  });

 //Photo API 

 async function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
     // response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  

    var ext = dataString.split(';')[0].match(/jpeg|png|gif/)[0];
    // strip off the data: url prefix to get just the base64-encoded bytes
    var data = dataString.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer.from(data, 'base64');
    var fileName = Date.now()+'.' + ext

    fs.writeFile(DIR+"/"+fileName, buf, function(err, result) {
        if(err) console.log('error', err);
      });

  
    return fileName;
  }
  


 router.post('/insertPhotos', async (req, res)=> {

   var photoArr = []
   var storyid = req.body.storyid

   await req.body.fileSource.forEach(async element => {

        var decodedImg = await decodeBase64Image(element);
        var image = decodedImg.split(".")
        var extension = image[1]
        var imgName = image[0]
        var midImgName = imgName+"_M"+"."+extension
        var smallImgName = imgName+"_S"+"."+extension

			

        Jimp.read(DIR+"/"+decodedImg)
            .then(lenna => {
                var height = lenna.bitmap.height
                var width = lenna.bitmap.width

                var reSizeH = Jimp.AUTO
                var reSizeW = 1500
                if(height > width) {
                    reSizeH = 1500
                    reSizeW = Jimp.AUTO
                } 

                return lenna
                .resize(reSizeW, reSizeH) // resize
                .quality(72) // set JPEG quality
                .write(DIR+"/"+midImgName); // save
            })
            .catch(err => {
                console.error(err);
            });

        Jimp.read(DIR+"/"+decodedImg)
        .then(lenna => {

            var height = lenna.bitmap.height
            var width = lenna.bitmap.width

            var reSizeH = Jimp.AUTO
            var reSizeW = 150
            if(height > width) {
                reSizeH = 150
                reSizeW = Jimp.AUTO
            } 
            return lenna
            .resize(reSizeW, reSizeH) // resize
            .quality(72) // set JPEG quality
            .write(DIR+"/"+smallImgName); // save
        })
        .catch(err => {
            console.error(err);
        });

        let photoDetails = new photo({

            storyid : req.body.storyid,
            imageName:decodedImg,
            midImageName : midImgName,
            smallImageName : smallImgName,
            status: "Active"

        })

       photoArr.push(photoDetails)
       console.log("decodedImg",decodedImg)
        
    });

   
    photo.savePhoto(photoArr,(err, photoArr) =>{
     if(err){
         res.json({success:false, msg:"Failed to insert story record."});
     }else{
         res.json({success:true, msg:photoArr});
     }
    })
 
 });


 router.post('/getPhotoByStoryId', (req, res,next)=> {
    var storyid = req.body.id;

    var conditions = { storyid: storyid };

    photo.getPhotoById(conditions,(err, story) =>{
     if(err){
         res.json({success:false, msg:"Failed to get story record."});
     }else{
         res.json({success:true, msg:story});
     }
    })
 
 });

 router.post('/removePhotoById', (req, res,next)=> {
    var id = req.body.id;

    var conditions = { _id: id };


    photo.getPhotoById(conditions,(err, story) =>{
        if(err){
            res.json({success:false, msg:"Failed to get  records."});
        }else{
            var smallImageName = story[0].smallImageName
            var imageName =  story[0].imageName
            var midImageName =  story[0].midImageName
            try {
                fs.unlinkSync(DIR+"/"+smallImageName)
                //file removed
              } catch(err) {
                console.error(err)
              }
              try {
                fs.unlinkSync(DIR+"/"+imageName)
                //file removed
              } catch(err) {
                console.error(err)
              }
              try {
                fs.unlinkSync(DIR+"/"+midImageName)
                //file removed
              } catch(err) {
                console.error(err)
              }
        photo.removePhoto(conditions,(err, story) =>{
            if(err){
                res.json({success:false, msg:"Failed to get story record."});
            }else{
                res.json({success:true, msg:story});
            }
            })
        }
        })

   
 
 });

 router.post('/removeStoryById', (req, res,next)=> {
    var story_id = req.body.id;

    var conditions = { storyid: story_id };

    var storyconditions = { _id: story_id };

    console.log("conditions >> ",conditions)

    photo.getPhotoById(conditions,(err, story) =>{

        if(err){
            res.json({success:false, msg:"Failed to get  records."});
        }else{


            story.forEach(image=>{

                var smallImageName = image.smallImageName
                var imageName =  image.imageName
                var midImageName =  image.midImageName
                try {
                    fs.unlinkSync(DIR+"/"+smallImageName)
                    //file removed
                  } catch(err) {
                    console.error(err)
                  }
                  try {
                    fs.unlinkSync(DIR+"/"+imageName)
                    //file removed
                  } catch(err) {
                    console.error(err)
                  }
                  try {
                    fs.unlinkSync(DIR+"/"+midImageName)
                    //file removed
                  } catch(err) {
                    console.error(err)
                  }

            })
        } 

    })


    photo.removeAllPhotoByStoryId(conditions,(err, story) =>{
     if(err){
         res.json({success:false, msg:"Failed to get story record."});
     }
    })

    story.removeStory(storyconditions,(err, storydes) =>{
     if(err){
         res.json({success:false, msg:"Failed to get story record."});
     }else{
         res.json({success:true, msg:storydes});
     }
    })
 
 });

 //Team 

 router.post('/insertTeam', (req, res,next)=> {
    let teamDetails = new team({
    name : req.body.name,
    description : req.body.description,
    status : req.body.status
    })
    
    console.log(teamDetails)
    team.saveCms(teamDetails,(err, team) =>{
     if(err){
         res.json({success:false, msg:"Failed to insert Team record."});
     }else{
         res.json({success:true, msg:teamDetails});
     }
    })
 
 });

 router.post('/updateTeam', async (req, res, next) =>{
    var name = req.body.name;
    var description = req.body.description;
    var status = req.body.status;
    var id = req.body.id;

    var conditions = { id: id };
    var update = { $set: { name: name, description: description,status : status } };
    var options = { multi: true ,new:true};
 
    console.log("name---",name)
    console.log("description---",description)
 
    try{
        let output = await team.updateteam(conditions,update,options);
       res.json(output);
    }
    catch(error){
        res.json(error);
    }
    
 })


 router.get('/getAllTeam', (req, res,next)=> {
    team.getAllteam((err, result) =>{
     if(err){
         res.json({success:false, msg:"Failed to insert cms record."});
     }else{
         res.json({success:true, msg:result});
     }
    })
 
 });

 router.post('/getTeamById', (req, res,next)=> {
    var  id = req.body.id;

    var conditions = { _id: id };

    team.getTeamById(conditions,(err, story) =>{
     if(err){
         res.json({success:false, msg:"Failed to get Team record."});
     }else{
         res.json({success:true, msg:story});
     }
    })
 
 });

 router.post('/removeTeamById', (req, res,next)=> {
    var  id = req.body.id;

    var conditions = { _id: id };

    team.removeTeam(conditions,(err, story) =>{
     if(err){
         res.json({success:false, msg:"Failed to remove Team record."});
     }else{
         res.json({success:true, msg:story});
     }
    })
 
 });
 
 

module.exports = router;


