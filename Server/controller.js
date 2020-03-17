'use strict';

let rxjs = require('rxjs');
const fs = require('fs');
let commondao = require("./commonDao.js");
let enums = require('./enums');

var common = new commondao();
var enumto = new enums();
let path = require('path');
module.exports = class Controller {
    constructor(){

    }
    logger(){
        console.log("Inside Controller")
    }

    registercontrol(registerData){
        return registerData;
    }

    connectController(){
      var message =  common.connectToDB();
      console.log(message);
      return message;
    }
  storecallrec(file)
        {
            let filename = file.originalname;
            console.log(file);

            let url = '/home/pavan1994rg/'+file.filename;
            console.log(url);
            common.addRecodings(url);

        }
    uploadImageFiles(req){
    const observabele  = new rxjs.Observable(observer=>{
        console.log(req);
        if (req.file) {
            console.log('Uploading file...');
            var filename = req.file.filename;
            var  originalFilename = req.file.originalname.split('.');
            return req.file;


            // var uploadStatus = 'File Uploaded Successfully';
        } else {
            console.log('No File Uploaded');
            // var filename = 'FILE NOT UPLOADED';
            // var uploadStatus = 'File Upload Failed';
        }


    })

return observabele;
} // upload image

fetchproducts(req){
    var give =[];
    console.log(req);
    return common.select_products();
    //  rxjs.Observable.create((observer)=>{
    //             // console.log(common.select_products())
    //             console.log("fetch");
    //             observer.next('fetch');

    //             //   common.select_products(observer).subscribe(res=>{
    //             //       console.log(res);
    //             //   });

    //     })
        // return observable;



} //fetch products

getEmployee(){
    let respo;
   common.getEmployee().then(res=>{

     respo = res;


   });
   console.log(respo);
return respo;

    // var bar = new Promise((resolve, reject) => {

    // }).then(() => {
    //     console.log('All done!');
    //     console.log('storing');


    // });
}


storeCustomerFiles(filesUrl){
    console.log('inside customer');
        let customerrecordingsJSON = []
        let customerWhatsapp=[];
        console.log(filesUrl);
        var bar = new Promise((resolve, reject) => {
            filesUrl.forEach(element =>
                {
                    console.log('inside foreach');
                if(element.includes('.mp3')){
                    customerrecordingsJSON.push(
                         element )
                    console.log(customerrecordingsJSON);
                } // check for recordings
                else if(".jpg"){
                    customerWhatsapp.push(element)
                }
                if(customerrecordingsJSON.length == filesUrl.length){
                    common.addRecodings(customerrecordingsJSON,'emp111222');

                }
                else if(customerWhatsapp.length ==  filesUrl.length){
                    common.addwhatsapp(customerWhatsapp,'emp111222');
                }
            });
        }).then(() => {
            console.log('All done!');
            console.log('storing');

        });

        // if(customerrecordingsJSON >0){

        // }
}

putProducts(req){
        console.log("bosdy"+ JSON.stringify(req));
     return common.putProducts(req);
}

updateProducts(req){
        return common.updateProducts(req.body.product)
}

fetchproducts_by_category(req){
      var catId = req.body.catID;
      return common.select_products_by_category(catId)
}

deleteProduct(body){
        return common.delete(body.id);
}

putCart(req){
  var parsed = JSON.parse(req.body.cart);
  var cartDetails = parsed;
      return common.insertCart(cartDetails);
}
getOrders(req){
    var parsed = req.body.contact;
    return common.getOrders(parsed);
}


}
