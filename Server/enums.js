let enum_ref = require("enum");
var enum_top = new enum_ref({'SeasonCode':'seas','Top_products':'toppro','Most_viewed':'mostview'});
module.exports = class enums{
    
 constructor(){

 }
getValue(code){
    var ret;
    switch (code) {
        case 'SeasonCode':
            console.log(enum_top.SeasonCode.value);
            ret=enum_top.SeasonCode.value;    
        //Do something related to A.
        break;
        case 'Top_products':
            ret=enum_top.Top_products.value;
        break;
         case 'Most_Viewed':
             ret=enum_top.Most_viewed.value;
         break;
        default:
           //Throw error
        break;
    
       
    }
    return ret;
} //get the value

}