const mysql =  require ("mysql");

let rxjs = require('rxjs');
let insertedIDs = [];
let connection;

module.exports = class CommonDAO{
    constructor(){

    }
    getconnection()
{
     connection = this.connectToDB();
}
    connectToDB(){
        var flag = false;
        var con = mysql.createConnection({
            host:"localhost",
            port:"3306",
            user:"root",
            password:"1111",
            database : "slvstore",
            port: 3306
        });
        con.connect((err)=>{
         if(err){
             throw err;
             flag = false;
         }
         else{
            console.log("connected");
            flag = true;
         }

        });
        while (!flag) {
            require('deasync').runLoopOnce();
        }
        return con;
    }

    insertAdmin(admin){

        this.connectToDB(); //connect to mysql database

    }

    insertProducts(prod){
        var connected = this.connectToDB();//.connect to mysql database
        if(connected == true){

        }
    }

      insertUser(user){
        var connection = this.connectToDB();
          let data =[];
          let parseduser = JSON.parse(user)
          data.push(parseduser.user_id);
          data.push(parseduser.phone);
          data.push(parseduser.password);
          let array = [];
          array.push(data);
      return new Promise(function(resolve,reject){
          var query = connection.query('INSERT INTO users VALUES ?', [array], (error, response) => {
              if(error){
                  console.log(error);
                 return reject;
                         }
              else{
                    return resolve(response);
              }
              });


        })

      }

      insertCart(cart){
        let data =[];
          var connection = this.connectToDB();
        cart.cartid = Math.floor(Math.random() * 10000000000000);
        data.push(cart.cartid);
        data.push(JSON.stringify(cart.orders));
        data.push(cart.phone);
        data.push(cart.total)
        let array = [];
        array.push(data);
        return new Promise(function(resolve,reject){
            var query = connection.query('INSERT INTO orders VALUES  ?', [array], (error, response) => {
                if(error){
                    console.log(error);
                   return reject;
                           }
                else{
                      return resolve(response);
                }
                });


          })


      }

    inportCSV(data){
        var flag = false;
        var connection = this.connectToDB();//.connect to mysql database
       // if(connection == true){
            var query = connection.query('INSERT INTO product_catalog  VALUES ?', [data], (error, response) => {
                if(error){
                    console.log(error);
                   throw error;
                           }
                else{
                    flag = true;
                }
                });
                while (!flag) {
                    require('deasync').runLoopOnce();
                }
                return flag;
        }
        select_products_by_category(catId){
          console.log('inside select produts')
          console.log(catId);
          var connection = this.connectToDB();
          var sql = "select * from product_catalog where product_category =?";
          console.log(sql);
          return new Promise( ( resolve, reject ) => {
              connection.query( sql,[catId],( err, rows ) => {
                  if ( err )
                      return reject( err );
                      // console.log(rows);
                  resolve( rows );
              } );
          } );
        }

        select_products(){
            console.log('inside select produts')
            var connection = this.connectToDB();
             // connect to mysql database;

        //               var query = connection.query('select * from  product_catalog ',(error,res)=>{
        //         if(error){
        //             return error
        //         }
        //         else{
        //             console.log(res);

        //             observe.next(res);
        //                 // console.log(res);


        //         }
        // })
        var sql = "select * from product_catalog";
        return new Promise( ( resolve, reject ) => {
            connection.query( sql,( err, rows ) => {
                if ( err )
                    return reject( err );
                    // console.log(rows);
                resolve( rows );
            } );
        } );
        }
        insertFilespath(){

        }
        updatefilePath(empId,files){

            var connection = this.connectToDB();//.connect to mysql database
            // if(connection == true){
                 var query = connection.query('select * from employee where empId = ?', [empId], (error, response) => {
                     if(error){
                         console.log(error);
                        this.insertFilespath(empId,files);
                     }
                     else{
                        var upadteQuery = connection.query('update employee set files = ? where empId =?',[files,empId],(err,response)=>{

                        })
                     }
                     });
                     while (!flag) {
                         require('deasync').runLoopOnce();
                     }


        }

        // addRecordings(files){

        // }

        // addWhatsAppImages(files){

        // }


        updateProducts(products){
        var product = JSON.parse(products);
        console.log(product)
            var connection = this.connectToDB();
            var records =[product.product_name,product.product_price,product.product_quantity,product.product_category,product.selling_price,product.product_id];
            return new Promise(function(resolve, reject){
                connection.query(
                    "UPDATE product_catalog SET product_name =?,product_price =?,product_quantity =?,product_category=?,selling_price = ? WHERE product_id =?"
                    ,records,
                    function(err, rows){
                        console.log(err);
                        if(rows === undefined){
                            reject(new Error("Error rows is undefined"));
                        }else{
                            console.log(rows);
                            resolve(rows);
                        }
                    }
                )}
            )

        }

        getEmployees(){
            var connection = this.connectToDB();//.connect to mysql database
            // if(connection == true){
                 var query = connection.query('select * from employee ', (error, response) => {
                     if(error){
                         console.log(error);

                     }
                     else{
                       return response;
                     }
                     });
                     while (!flag) {
                         require('deasync').runLoopOnce();
                     }
        }
        delete(id){
            let product_id =[id]
            var connection = this.connectToDB();
            return new Promise(function(resolve, reject){
                connection.query(
                    "delete from product_catalog where product_id =?"
                    ,product_id,
                    function(err, rows){
                        console.log(err);
                        if(rows === undefined){
                            reject(new Error("Error rows is undefined"));
                        }else{
                            console.log(rows);
                            resolve(rows);
                        }
                    }
                )}
            )


        }


        deleteProducts(id){
            var connection = this.connectToDB();
            return new Promise(function(resolve, reject){
                connection.query(
                    "select * from employee"
                    ,
                    function(err, rows){
                        if(rows === undefined){
                            reject(new Error("Error rows is undefined"));
                        }else{
                            console.log(rows);
                            resolve(rows);
                        }
                    }
                )}) 
        

        }


        getOrders(contact){
            let phone =[contact]
            var connection = this.connectToDB();
            return new Promise(function(resolve, reject){
                connection.query(
                    "select * from orders where phone = ?"
                    ,phone,
                    function(err, rows){
                        console.log(err);
                        if(rows === undefined){
                            reject(new Error("Error rows is undefined"));
                        }else{
                            console.log(rows);
                            resolve(rows);
                        }
                    }
                )}
            )
        }
    putProducts(prod){
        var connection = this.connectToDB();
        return new Promise(function (resolve, reject) {
                var values = [];
                var temp =[];
                console.log("===="+prod)
                var products = JSON.parse(prod);
            console.log("prod"+products);
            products.forEach(function (row) {
                    temp =[];
                    Object.keys(row).forEach(function (key) {
                        temp.push(row[key]);
                    })
                    values.push(temp);
                })
                console.log(values);
                connection.query("insert into product_catalog values ?",[values], function (err, result, fields) {
                    if (err)
                        console.log(err);
                    console.log(result);
                    return resolve(result);
                });

        })
    }


     getCategories(){
         var connection = this.connectToDB();
         return new Promise(function (resolve, reject) {
             connection.query("SELECT * FROM categories", function (err, result, fields) {
                     if (err) return reject;
                     console.log(result);
                     return resolve(result);
                 });
         })
     }

        getRecordings(){
            var connection = this.connectToDB();
            return new Promise(function(resolve, reject){
                connection.query(
                    "select * from recordings "
                    ,
                    function(err, rows){
                        if(rows === undefined){
                            reject(new Error("Error rows is undefined"));
                        }else{
                            console.log(rows);
                            resolve(rows);
                        }
                    }
                )}
            )

        }
        getWhatsApp(){
            var connection = this.connectToDB();
            return new Promise(function(resolve, reject){
                connection.query(
                    "select * from whatsapp "
                    ,
                    function(err, rows){
                        if(rows === undefined){
                            reject(new Error("Error rows is undefined"));
                        }else{
                            console.log(rows);
                            resolve(rows);
                        }
                    }
                )}
            )
        }
        getWhatsapp22(empId){
            var connection = this.connectToDB();//.connect to mysql database
            // if(connection == true){
                 var query = connection.query('select * from employee where empId = ?', [empId], (error, response) => {
                     if(error){
                         console.log(error);

                     }
                     else{
                         let whatsapprespnse=[];
                         for(let i=0;i<response[0].whatsappid.length;i++){
                            var query = connection.query('select * from whatsapp where  id = ?', [response[0].whatsappid[i]], (error, response) => {
                                if(error){
                                    console.log(error);

                                }
                                else{

                                    whatsapprespnse.push(response[0]);
                                }
                                });
                                if(response[[0].length == i]){
                                    return whatsapprespnse;
                                }
                         }


                     }
                     });
                     while (!flag) {
                         require('deasync').runLoopOnce();
                     }
        }
        getRecordings22(empId){
            var connection = this.connectToDB();//.connect to mysql database
            // if(connection == true){
                 var query = connection.query('select * from employee where empId = ?', [empId], (error, response) => {
                     if(error){
                         console.log(error);

                     }
                     else{
                         let whatsapprespnse=[];
                         for(let i=0;i<response[0].whatsappid.length;i++){
                            var query = connection.query('select * from recordings where  id = ?', [response[0].recordingid[i]], (error, response) => {
                                if(error){
                                    console.log(error);

                                }
                                else{

                                    whatsapprespnse.push(response[0]);
                                }
                                });
                                if(response[[0].length == i]){
                                    return whatsapprespnse;
                                }
                         }


                     }
                     });
                     while (!flag) {
                         require('deasync').runLoopOnce();
                     }
        }

        addempolyeeWhats(urls,empId){

            let str = urls.toString();
            console.log(str);
               var query = connection.query('select * from employee where employeename = ?',empId, (error, response) => {
                   if(error){
                       console.log(error);


                   }
                   else{
                       console.log(response);
                       let insertvalues =[];
                       insertvalues.push([empId,str,str]);
                       if(response.length == 0){
                           var query = connection.query('insert into   employee (employeename,whatsappid ) values ?', [empId,insertvalues], (error, response) => {
                               if(error){
                                   console.log(error);

                               }
                               else{

                                   var queryURL= connection.query('update employee set whatsappid = ?, where employeename = ? ', [insertvalues,empId], (error, response) => {
                                       if(error){
                                           console.log(error);

                                       }
                                       else{


                                   }
                                       });
                           }
                               });
                       }
                       else{
                           var query = connection.query('insert into   employee (employeename,recordingid,whatsappid) values ?', [insertvalues], (error, response) => {
                               if(error){
                                   console.log(error);

                               }
                               else{

                                   console.log(response.insertId);
                                   for(let i=0;i<=urls.length;i++){
                                       insertedIDs.push(response.insertId++);
                                       if(urls.length == insertedIDs.length){
                                           console.log(insertedIDs);
                                           this.addempolyee(insertedIDs,empID);
                                       }

                                  // var upadteQuery = connection.query('update employee set files = ? where empId =?',[files,empId],(err,response)=>{

                                  // })
                               }
                           }
                               });

                       }
                      // var upadteQuery = connection.query('update employee set files = ? where empId =?',[files,empId],(err,response)=>{

                      // })
                   }
                   });
           }

        addempolyee(urls,empId){

         let str = urls.toString();
         console.log(str);

         var query = connection.query('select * from employee where employeename = ?',empId, (error, response) => {
                if(error){
                    console.log(error);


                }
                else{
                    console.log(response.length);
                    let insertvalues =[];
                    insertvalues.push([empId,str]);
                    console.log(insertvalues);

                    if(response.length == 0){
                        var query = connection.query('insert into   employee (employeename,recordingid) values ?', [insertvalues], (error, response) => {
                            if(error){
                                console.log(error);

                            }
                            else{



                        }
                            });
                    }
                    else{
                        console.log(insertvalues[0]);
                        let temp =insertvalues[0][1].split(',');
                        let newvalues = [];
                        temp.forEach(element=>{
                           newvalues.push(parseInt(element));
                        })
                        console.log(newvalues);
                        let update = response[0].recordingid.split(',');
                         update.forEach(element=>{
                             newvalues.push(parseInt(element));

                         })
                         console.log(newvalues);
                         let newupdate =[];
                         newupdate.push([newvalues]);
                         let string = newvalues.toString();
                         console.log(string);
                //         var upadteQuery = connection.query('update employee set files = ? where empId =?',[files,empId],(err,response)=>{

                //    })

                     var queryURL= connection.query('update employee set recordingid = ? where employeename = ? ', [string,empId], (error, response) => {
                                    if(error){
                                        console.log(error);

                                    }
                                    else{


                                }
                                    });
                    }

                }
                });
        }
        addRecodings(urls,empID){
            this.getconnection();
            console.log(urls);
            let tmpurls =[];
            let insertvalues =[];
            insertvalues.push([urls]);
            console.log(tmpurls);
            var query = connection.query('insert into  recordings (url) values ?', [insertvalues], (error, response) => {
                if(error){
                    console.log(error);

                }
                else{

                //     console.log(response.insertId);
                //     for(let i=0;i<=urls.length;i++){
                //         insertedIDs.push(response.insertId++);
                //         if(urls.length == insertedIDs.length){
                //             console.log(insertedIDs);
                //         }

                //    // var upadteQuery = connection.query('update employee set files = ? where empId =?',[files,empId],(err,response)=>{

                //    // })
                // }
            }
                });
        }

        addwhatsapp(urls,empID){
            this.getconnection();
            console.log(urls);
            let tmpurls =[];
            urls.forEach(element => {
                tmpurls.push([element]);
            });
            console.log(tmpurls);
            var query = connection.query('insert into  whatsapp  (url) values ?', [tmpurls], (error, response) => {
                if(error){
                    console.log(error);

                }
                else{
                    console.log(urls.length);
                    console.log(response.insertId);
                    for(let i=0;i<=urls.length;i++){
                        insertedIDs.push(response.insertId++);
                        if(urls.length == insertedIDs.length){
                            console.log(insertedIDs);
                        }

                   // var upadteQuery = connection.query('update employee set files = ? where empId =?',[files,empId],(err,response)=>{

                   // })
                }
            }
                });


            }

            addemployeewhatsapp(urls,empId){
                let str = urls.toString();
                console.log(str);

                var query = connection.query('select * from employee where employeename = ?',empId, (error, response) => {
                       if(error){
                           console.log(error);


                       }
                       else{
                           console.log(response);
                           let insertvalues =[];
                           insertvalues.push([empId,str]);
                           console.log(insertvalues);
                           if(response.length == 0){
                               var query = connection.query('insert into   employee (employeename,whatsappid) values ?', [insertvalues], (error, response) => {
                                   if(error){
                                       console.log(error);

                                   }
                                   else{



                               }
                                   });
                           }
                           else{
                               console.log(insertvalues[0]);
                               let temp =insertvalues[0][1].split(',');
                               let newvalues = [];
                               temp.forEach(element=>{
                                  newvalues.push(parseInt(element));
                               })
                               console.log(newvalues);
                               let update = response[0].whatsappid.split(',');
                                update.forEach(element=>{
                                    newvalues.push(parseInt(element));

                                })
                                console.log(newvalues);
                                let newupdate =[];
                                newupdate.push([newvalues]);
                                let string = newvalues.toString();
                                console.log(string);
                       //         var upadteQuery = connection.query('update employee set files = ? where empId =?',[files,empId],(err,response)=>{

                       //    })

                            var queryURL= connection.query('update employee set whatsappid = ? where employeename = ? ', [string,empId], (error, response) => {
                                           if(error){
                                               console.log(error);

                                           }
                                           else{


                                       }
                                           });
                           }

                       }
                       });
            }

            insertrec(filename,url){
                var connection = this.connectToDB();//.connect to mysql database
                // if(connection == true)
                let insertvalues =[];
                insertvalues.push([url,filename]);

                     var query = connection.query('insert into recordings(url,filename) values ?', [insertvalues], (error, response) => {
                         if(error){
                             console.log(error);

                         }
                         else{
                             console.log(response);
                            // var upadteQuery = connection.query('update employee set files = ? where empId =?',[files,empId],(err,response)=>{

                            // })
                         }
                         });
                        //  while (!flag) {
                        //      require('deasync').runLoopOnce();
                        //  }



            }


        addCustomersbyFiles(){
            var connection = this.connectToDB();//.connect to mysql database
            // if(connection == true)

                 var query = connection.query('insert employee values ?', [files], (error, response) => {
                     if(error){
                         console.log(error);

                     }
                     else{
                         console.log(response);
                        // var upadteQuery = connection.query('update employee set files = ? where empId =?',[files,empId],(err,response)=>{

                        // })
                     }
                     });
                     while (!flag) {
                         require('deasync').runLoopOnce();
                     }



        }


}
