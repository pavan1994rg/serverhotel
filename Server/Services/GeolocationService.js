
const NodeGeocoder = require('node-geocoder');
const options = {
    provider: 'google',
   
    // Optional depending on the providers
   
    apiKey: 'AIzaSyAYqKc4--nr4GX-DmnCCjrKv3mSWBumFyM', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
  };
module.exports = class GeolocationService{
    constructor(){}
     
    getpincode(latitude,longitude){
        let geocoder = NodeGeocoder(options);
        console.log(latitude);
        
        return geocoder.reverse({ lat: latitude, lon: longitude });
    }

}