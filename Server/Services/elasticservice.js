const elasticsearch = require('elasticsearch');

module.exports = class elasticservice{
    esClient;
    constructor(){
        
       this.esClient = new elasticsearch.Client({
            host: '127.0.0.1:9200',
            log: 'error'
          })
    }
 
    

    checkHealth(){
         return this.esClient.cat.indices({v: true});
          
    }
    search(index,name){
        let body = {
            size: 20,
            from: 0,
            query: {
              match: {
                name:name
              }
            }
          };
            return this.esClient.search({index: index, body: body});
    }


}