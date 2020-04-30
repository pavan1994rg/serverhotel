// const express = require ("express");
// var app =  express();


// class Main{
//     constructor(){
//         app.get('/',function(req,res){

//             res.send("hello world");
//         })

//         app.listen(3000);
//     }


// }

// require 3rd party library

var express = require('express');
const fs = require('fs');
const csv = require('fast-csv');
const multer = require('multer');
const imageupload = multer({dest: './Assets/ProductImages/'})
let commondao = require("./commonDao.js");
// require own library
let control = require('./controller.js');
let jsonparse = require('./jsonParse.js');
let importcsv = require('./importcsv.js');
const bodyParser = require('body-parser')
let enums = require('./enums');
let path = require('path');
var unzip = require('unzipper');
util = require('util');
var importCSV = new importcsv();
var app = express();
var extract = require('extract-zip')
var cors = require('cors')
app.use(express.json());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})
var controller = new control();
var jsonToParse = new jsonparse();
var mainenum = new enums();
var injectable = require('./Services/OtpService');
var orderservice = require('./Services/orderservice');
var elasticservice = require('./Services/elasticservice');
var paymentservice = require('./Services/PaymentService');
var geoservice = require ('./Services/GeolocationService');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './home/pavan/uploads')
//     },
//     filename: function (req, file, cb) {
//       let extArray = file.mimetype.split("/");
//       let extension = extArray[extArray.length - 1];
//       cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
//     }
//   })
//   const upload = multer({ storage: storage })
app.get('/', function (req, res) {
    if (req.query.url != undefined) {

        console.log(req.body);
        let localpath = req.query.url.toString();
        console.log(localpath);
        res.writeHead(200, 'image/jpeg');
        fs.createReadStream(localpath).pipe(res);

    } else {
        console.log(req.body);
        let localpath = req.query.recurl.toString();
        console.log(localpath);
        res.writeHead(200, 'image/mpeg');
        fs.createReadStream(localpath).pipe(res);
    }

    // res.send(mainenum.getValue('SeasonCode'));
});
app.get('/login', (req, res) => {
    res.send({username: 'pavan', password: '123456'})
})

app.get('/admin', (req, res) => {
    controller.logger();
})

app.post('/register', (req, res) => {
    var responseData = controller.registercontrol(req);
    res.send({register: responseData});
})

app.get('/connect', (req, res) => {
    var responseDisplay = controller.connectController();
    console.log(responseDisplay);
    res.send(responseDisplay);
})

app.post('/putCategories',(req,res)=>{
    controller.putCategories(req).then((result)=>{
         res.send(result);
    })
})  

app.post('/addproducts', (req, res) => {
    var jsonData = jsonToParse.parseJson(req);
    controller.addProducts(jsonData);
})

// sample csv upload code
app.post('/Upload', upload.array('myFile', 12), function (req, res, next) {
    console.log(req.files);
    if (req.files.length > 0) {

        var arrayfiles = [];
        req.files.forEach(function (file) {
            console.log('Uploading file...');
            arrayfiles.push({url: __dirname+'/uploads/' + file.filename})
        })
        res.send(arrayfiles);

        // res.send({
        //     requestcommand:"uploadCsv",
        //      argsList:[{
        //         name:"status",
        //         value:true,
        //         type:uploaded
        //     }]
        // })

        // var uploadStatus = 'File Uploaded Successfully';
    } else {
        console.log('No File Uploaded');
        // var filename = 'FILE NOT UPLOADED';
        // var uploadStatus = 'File Upload Failed';
    }
})



app.post('/insertCart',function(req,res){
        console.log(req);
        JSON.parse(req.body.cart).token =  JSON.parse(req.body.cart).token+Math.floor(Math.random() * 10000000000000);
        controller.putCart(req).then(function(rows){
          if(rows.affectedRows == 1){
             let order = new orderservice();
             let userparsed = JSON.parse(req.body.cart);
             let products = JSON.parse(userparsed.orders);
             console.log("products"+products.length);
             var table_body = '<table border="1" id="example"><thead><tr><th> Product Name</th><th> Product Price </th><th>Product Quantity</th><th>Numbers</th></tr></thead><tbody>';
                 for(var i =0; i<products.length;i++){
                     table_body+='<tr>';
                     table_body +='<td>';
                     table_body +=products[i].product_name;
                     table_body +='</td>';
                     table_body +='<td>';
                     table_body +='&#x20b9;'+products[i].product_price;
                     table_body +='</td>';
                     table_body +='<td>';
                     table_body +=products[i].product_quantity;
                     table_body +='</td>';
                     table_body +='<td>';
                     table_body +=products[i].value;
                     table_body +='</td>';
                     table_body+='</tr>';
                 }
                 table_body+='</tbody></table>';
                 table_body+='<table border="1" id="example"><thead><tr>Total</tr></thead><tbody>'
                 table_body+='<tr>';
                 table_body+='<td>';
                 table_body+= '&#x20b9; :'+userparsed.total;
                 table_body+='</tr>';
                 table_body+='</td>';
                 table_body+='</tbody></table>';
                 table_body+='<table border="1" id="example"><thead><tr>Phone Number</tr></thead><tbody>'
                 table_body+='<tr>';
                 table_body+='<td>';
                 table_body+='Phone :'+userparsed.phone;
                 table_body+='</tr>';
                 table_body+='</td>';
                 table_body+='<table border="1" id="example"><thead><tr>Token</tr></thead><tbody>'
                 table_body+='<tr>';
                 table_body+='<td>';
                 table_body+='Token :'+userparsed.token;
                 table_body+='</tr>';
                 table_body+='</td>';
                 table_body+='</tbody></table>';
                 controller.getemailfromrest(req).then(result=>{
                     console.log(result);
                     if(result){
                        order.sendEmail(result[0].email_id,table_body,userparsed.phone).then(function(info){
                            res.send(info);
                            })
                     }
                 })
            
          }
        })
})
app.post('/putProducts', function (req, res) {
    console.log(req);
    console.log(req.body.products);
    controller.putProducts(req.body.products).then(function (rows) {
        res.send(rows);
    })
})
app.post('/UploadImage', imageupload.single('imagefile'), (req, res) => {
    if (req.file) {
        console.log('Uploading file...');
        var imagepath = req.file.filename;
        res.send(req.headers.host + '/Assets/ProductImages' + imagepath + '.jpeg')

        // var uploadStatus = 'File Uploaded Successfully';
    } else {
        console.log('No File Uploaded');
        // var filename = 'FILE NOT UPLOADED';
        // var uploadStatus = 'File Upload Failed';
    }


})

app.post('/requestToken',function(req,res){
      var service = new injectable();
     service.authToken(req.body.token).then(function(token){
       if(token.success === 'true'){
         res.send(JSON.stringify(token));
       }
       else{
         res.send('something went wrong')
       }
     })
})

app.post('/sendEmail',function(req,res){
        let email = new orderservice();
        console.log(req.body.email);
        let parsedbody = JSON.parse(req.body.email);
        email.sendEmail(parsedbody.email,parsedbody.body).then(function(info){
                  res.send(info);
        })

})
app.post('/registerUser',function(req,res){
  var common  = new commondao();
    common.insertUser(req.body.user).then(function(user){
      res.send(user);
    })
})

app.post('/sendOTP',function(req,res){
      var service = new injectable();
      console.log(req.body.user);
      service.registerUser(req.body.user).then(function(reg){
        if(reg.response.success === true){
            console.log("res"+reg);
          res.send({'authyId':reg.authyId});
        }
        else{
          res.send('something went wrong')
        }
      })
     })

app.get('/getCategories', function (req, res) {
        var common  = new commondao();
    common.getCategories().then(function (rows) {
        rows.forEach((row)=>{
            row.category_image = __dirname+'/uploads/'+ row.category_image
        })
        res.send(rows);
    })
})


app.post('/getProductsByCategory', (req, res) => {
    console.log(req + "request got");
    var response = controller.fetchproducts_by_category(req).then(prod => {
        res.send(prod);
    });

    // var result = controller.fetchproducts().subscribe(x=>{
    //    res.send(x);
    // })

}) //getproducts
app.get('/getProducts', (req, res) => {
    var response = controller.fetchproducts().then(prod => {
        res.send(prod);
    });
    // var result = controller.fetchproducts().subscribe(x=>{
    //    res.send(x);
    // })

}) //getproducts

app.get('/getRecordings', (req, res) => {
    let common = new commondao();
    common.getRecordings().then(resp => {
        res.send(resp);
    })

    // var result = controller.fetchproducts().subscribe(x=>{
    //    res.send(x);
    // })

}) //getproducts
app.get('/getEmployee', (req, res) => {
    let common = new commondao();
    common.getEmployee().then(resp => {
        res.send(resp);
    })

    // var result = controller.fetchproducts().subscribe(x=>{
    //    res.send(x);
    // })

}) //getproducts

app.post('/updateProducts', (req, res) => {
    let common = new commondao();
    controller.updateProducts(req).then(resp => {
        res.send(resp);
    })

    // var result = controller.fetchproducts().subscribe(x=>{
    //    res.send(x);
    // })

}) //getproducts


app.get('/getWhatapp', (req, res) => {
    let common = new commondao();
    common.getWhatsApp().then(resp => {
        res.send(resp);
    })

    // var result = controller.fetchproducts().subscribe(x=>{
    //    res.send(x);
    // })

}) //getproducts


// app.get('/getRecordings',(req,res=>{

// }))


app.post('/deleteProduct',(req,res)=>{
        controller.deleteProduct(req.body).then(result=>{
            res.send(result);
        })
})
app.get('/streamrecord', (req, res) => {
    console.log(req.body.url);
//    let localpath =  path.join(__dirname,'music.mp3');

    let localpath = "/home/pavan/Desktop/music1.mp3";


    res.writeHead(200, 'audio/mpeg');
    fs.createReadStream(localpath).pipe(res);

    // var readStream = fs.createReadStream(req.query.url);
    // // We replaced all the event handlers with a simple call to util.pump()
    // readStream.pipe(res);
    // var result = controller.fetchproducts().subscribe(x=>{
    //    res.send(x);
    // })

})
app.get('/streamimage', (req, res) => {
    console.log(req.body);
    let localpath = path.join(__dirname, '');
    console.log(localpath);

    res.writeHead(200, 'image/jpeg');
    fs.createReadStream(localpath).pipe(res);

    // var readStream = fs.createReadStream(req.query.url);
    // // We replaced all the event handlers with a simple call to util.pump()
    // readStream.pipe(res);
    // var result = controller.fetchproducts().subscribe(x=>{
    //    res.send(x);
    // })

})


function getEmployee(req, res) {

}

function parseFile(req, res, next) {
    var filePath = req.files.file.path;
    console.log(filePath);


}

app.post('/getOrders',function(req,res){
    controller.getOrders(req).then(result=>{
        if(res !== undefined){
            res.send(result);
        }
    })

})

app.get('/getelastichealth',function(req,res){
    let elastic = new elasticservice();
    elastic.checkHealth().then(result=>{
        res.send(result)
    }).catch(err=>{
        res.send(err)
    })
})

app.post('/getsearch',function(req,res){
    let elastic = new elasticservice();
    console.log(req.body.searchText);
    elastic.search('rhelastic',req.body.searchText).then(result=>{
        console.log(result);
        res.send(result)
    }).catch(err=>{
        console.log(err);
        res.send(err)
    })
})

app.post('/charge',function(req,res){
    let payment = new paymentservice();
    let parsed = JSON.parse(req.body.payment)
    payment.chargePayment(parsed.charge).then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send(err)
    })
})

app.post('/getpincode',function(req,res){
       console.log(req.body.location);
    let geo = new geoservice();
   
    let location = JSON.parse(req.body.location);
    console.log( location.lat);
    geo.getpincode(location.lat,location.lon).then(result=>{
        res.send(result);
    })
  

})  

app.post('/getrestaurant',function(req,res){
    console.log(req);
    controller.getRestaurants(req).then(result=>{
        if(result){
            res.send(result);
        }
    })


})

app.post('/getfoodbyreshot',function(req,res){
    console.log(req);
    controller.getFoodbyHotRes(req).then(result=>{
        if(result){
            res.send(result);
        }
    })


})

app.post('/gethotelsnearby',function(req,res){
    let geo = new geoservice();
    let parsed = JSON.parse(req.body.location);
    console.log(req.body.location);
    geo.getpincode(parsed.lat,parsed.lon).then(result=>{
            if(result){
                console.log(result);
                controller.getHotelsbyLocation(result[0].zipcode).then(hotel=>{
                    res.send(hotel);
                })
                
            }
    })

})
app.post('/createToken',function(req,res){
    let payment = new paymentservice();
    let parsed = JSON.parse(req.body.card);
    payment.createToken(parsed).then(result=>{
        if(result)
        res.send(result);
    }).catch(err=>{
        res.send(err);
    })
   

})

app.post('/chargepayment',function(req,res){
    let payment = new paymentservice();
    let parsed = JSON.parse(req.body.charge);
    payment.chargePayment(parsed).then(result=>{
        if(result)
        res.send(result);
    }).catch(err=>{
        res.send(err);
    })
})

app.post('/rating',function(req,res){   
    console.log(JSON.stringify(req.body)); 
    controller.insertrating(req).then(rows=>{
      
        controller.selectRatings().then(result=>{
            console.log(JSON.stringify(result));
            res.send(result);
        }).catch(err=>{
            res.send(err)
        })
    }).catch(err=>{
        res.send(err);
    })
    
})

app.get('/selectrating',function(req,res){
    controller.selectRatings().then(result=>{
        console.log(JSON.stringify(result));
    
        res.send(result);
    }).catch(err=>{
        res.send(err)
    })
})


//sendMail
// app.post('/sendmail',(req,res) =>{
//     console.log(req.body.user);
//     let orderservice = new orderservice()
//     orderservice.sendMail()
// })
//email,body
//parsed.email.emailid, parsed.body

var server = app.listen(3002, function () {
});
