
const fs = require('fs');
function traverseDirectory(dirname, callback) {
    var directory = [];
    fs.readdir(dirname, function(err, list) {
      dirname = fs.realpathSync(dirname);
      if (err) {
        return callback(err);
      }
      var listlength = list.length;
      list.forEach(function(file) {
        file = dirname + '\\' + file;
        fs.stat(file, function(err, stat) {
          directory.push(file);
   if (stat && stat.isDirectory()) {
            traverseDirectory(file, function(err, parsed) {
       directory = directory.concat(parsed);
       if (!--listlength) {
         callback(null, directory);
       }
     });
   } else {
       if (!--listlength) {
         callback(null, directory);
       }
            }
        });
      });
    });
  }

  traverseDirectory(__dirname+'/uploads/', function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });