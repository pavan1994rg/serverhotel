module.exports = class JsonParser{
    
        
    
    constructor(){

    }
    parseJson(reqData){
        if(reqData.requestCommand == "addProducts"){
            reqData.argsList.forEach(element => {
              if(element.name  == "products"){
                  return element.value;
              }      
            });
        }       

    }  // parse products json 


    




}