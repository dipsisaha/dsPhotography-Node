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

const passport = require('passport');
var request = require('request');


var async = require('async');

router.post('/api/login', (req, res,next)=> {
    console.log("aaaaaaaaa")
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


