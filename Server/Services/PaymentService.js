
const stripe = require('stripe')('sk_test_5wX4oamTnVH3f4wQztT47ZtL00z0TJEYn8');
module.exports = class PaymentService{

    constructor(){

    }

   
    createToken(card){
     return new Promise((resolve,reject)=>{
       console.log(JSON.stringify(card));
       console.log(parseInt(card.exp))
       card.number = card.number.replace(/ +/g, "");
       console.log(card.number);
       console.log(parseInt("20"+card.year))
        stripe.tokens.create(
          {
            card: {
              number: card.number.trim(),
              exp_month:parseInt(card.month),
              exp_year: parseInt("20"+card.year),
              cvc: card.cvc,
            },
          },
          function(err, token) {
              if(token)
              return resolve(token)
              else
              return reject(err)
            // asynchronously called
          }
        );
      })
     
    }

    chargePayment(charge){
        return new Promise((resolve,reject)=>{
            stripe.charges.create(
                {
                  amount: charge.amount *`100`,
                  currency: 'inr',
                  source: charge.token,
                  description: 'My First Test Charge (created for API docs)',
                },
                function(err, charge) {
                  // asynchronously called
                  if(err){
                    reject(err)
                  }
                  else{
                      resolve(charge)
                  }

                }
              );

        })
        
    }



}