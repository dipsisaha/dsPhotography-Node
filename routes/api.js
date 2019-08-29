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

const passport = require('passport');
var request = require('request');


var async = require('async');

router.post('/insertAdminDetails', (req, res,next)=> {
   let adminLoginDetails = new adminLogin({
    userName : req.body.username,
    email : req.body.email,
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
    var id = req.body.id;

    var conditions = { _id: id };
    var update = { $set: { userName: userName,email: email, password: password,fb: fb,insta: insta  } };
    var options = { multi: true ,new:true};
 
    console.log("userName---",userName)
    console.log("password---",password)
 
    adminLogin.updateAdmin(conditions,update,options,(err, adminLogin) =>{
        if(err){
            res.json({success:false, msg:"Failed to Update Details"});
        }else{
            res.json({success:true, msg:adminLogin});
        }
    })

 })

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
         res.json({success:false, msg:"Failed to insert cms record."});
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

 router.post('/removeStoryById', (req, res,next)=> {
    var id = req.body.id;

    var conditions = { _id: id };


    story.removeStory(conditions,(err, story) =>{
     if(err){
         res.json({success:false, msg:"Failed to get story record."});
     }else{
         res.json({success:true, msg:story});
     }
    })
 
 });

 //Photo API 

 router.post('/insertPhotos', (req, res,next)=> {
    
    var photoArr = []
    for (var i=0;i<req.body.length;i++) {
     
        let photoDetails = new photo({
        story_id : req.body[i].story_id,
        title : req.body[i].title,
        imageName:req.body[i].imageName,
        status: req.body[i].status
        })

        photoArr.push(photoDetails)
    }
    
    photo.savePhoto(req.body,(err, photoDetails) =>{
     if(err){
         res.json({success:false, msg:"Failed to insert story record."});
     }else{
         res.json({success:true, msg:photoDetails});
     }
    })
 
 });


 router.post('/getPhotoByStoryId', (req, res,next)=> {
    var story_id = req.body.id;

    var conditions = { story_id: story_id };


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


    photo.removePhoto(conditions,(err, story) =>{
     if(err){
         res.json({success:false, msg:"Failed to get story record."});
     }else{
         res.json({success:true, msg:story});
     }
    })
 
 });

 router.post('/removeAllPhotoByStoryId', (req, res,next)=> {
    var story_id = req.body.story_id;

    var conditions = { story_id: story_id };


    photo.removeAllPhotoByStoryId(conditions,(err, story) =>{
     if(err){
         res.json({success:false, msg:"Failed to get story record."});
     }else{
         res.json({success:true, msg:story});
     }
    })
 
 });
 
 

module.exports = router;


