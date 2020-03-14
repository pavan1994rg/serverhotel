'use strict';

let rxjs = require('rxjs');
const fs = require('fs');
let path = require('path');
var authy = require('authy')('XgfTBlCnitEhXbeXgMhV64lhiFZX2fWe');
let commonDAO = require('../commonDao');
let authyId ;
module.exports = class OtpService {
   constructor(){

   }

   err(message){
     return message;
   }
  registerUser(user){
      return new Promise(function(resolve,reject){
     authy.register_user('prasanna1998rg@gmail.com',user,'91',function (err, res) {
    console.log(res);
    if(err){
      console.log(err)
    }
    else{
      authyId = res.user.id;
      console.log(authyId)

        authy.request_sms(authyId,function(err,otp){
          if(err){
            console.log(err);
             reject
          }
          else{
            console.log(otp);
              return resolve(otp);

          }
        })
    }
      })
});

    }
   requestOTP(){
    return authy.request_sms(authyId)
   }
   authToken(Usertoken){
     console.log(authyId)
     return new Promise(function(resolve,reject){
       authy.verify(authyId,Usertoken,function(err,res) {
              if(err){
                console.log(err)
                return reject(err);
              }
              else{
                console.log(res);
                return resolve(res)
              }
       })
     })

   }
}
