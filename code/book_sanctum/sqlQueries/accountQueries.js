
const { Pool, Client } = require("pg");
const pool = new Pool({
  user: "apqsznwhludbct",
  host: "ec2-35-172-85-250.compute-1.amazonaws.com",
  database: "d66prsg7g28r53",
  password: "161239fa8d874dbc62119103682c4b1e4bd64c313a1535ddcd98f406301a262f",
  port: "5432",
  ssl: true
});

function addClientAddress(username, address_id,res){

  pool.query("INSERT INTO client_address VALUES ($1, $2);",
             [username, address_id], (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log(result.rows) // brianc
    res.json(JSON.stringify(result.rows));
  })
}

function addClientBilling(cardNum, username,res,returnData){

  pool.query("INSERT INTO client_billing VALUES ($1, $2);",
             [cardNum, username], (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log(result.rows) // brianc
    if(returnData){
      res.json(JSON.stringify(result.rows));
    }
  })
}

function addAddressMain(username, region, city, code, street, apt,res){

  pool.query("INSERT INTO address_main values (default, $1, $2, $3, $4) RETURNING id;",
             [region, code, street, apt], (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log(result.rows) // brianc
    addClientAddress(username, result.rows[0].id,res);
  })
}

function accountQueries(){
  this.validateEmail = function(email, res){
    pool.query("select username from client where lower(username) = lower($1);",
               [email], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));

    })

  }
  this.loginAdmin = function (username, password, res){
    console.log("username = "+ username);
    console.log("password = " + password);

    return new Promise (function(resolve, reject){
        pool.query("select email from admin "+
                 "where LOWER(email) = LOWER($1) "+
                 "AND password = $2;",
                 [username, password], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        console.log(result.rows) // brianc
        if(result.rows.length==0){
          resolve('');
        }
        else{
          resolve(result.rows[0]["email"]);
        }
      })
    });

  }

  this.login = function (username, password, res){
    console.log("username = "+ username);
    console.log("password = " + password);

    return new Promise (function(resolve, reject){
        pool.query("select username from client "+
                 "where (LOWER(username) = LOWER($1) "+
                 "or LOWER(email) = LOWER($1) ) "+
                 "AND password = $2;",
                 [username, password], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        console.log(result.rows) // brianc
        //res.json(JSON.stringify(result.rows));
        if(result.rows.length==0){
          resolve('');
        }
        else{
          resolve(result.rows[0]["username"]);
        }
      })
    });

  }

  this.signup = function (username, password, email, fname, lname, res){
    console.log("username = "+ username);
    console.log("password = " + password);

    return new Promise (function(resolve, reject){
        pool.query("insert into client values ($1, $2, $3, $4, $5);",
                 [username, email, fname, lname, password], (err, result) => {
        if (err) {
        resolve("");
        }
        else{
        resolve(username);
        }
      })
    });
  }

  this.addAddress = function(username, region, city, code, street, apt, res){
    console.log(username+" "+region+" "+city+" "+code+" "+street+" "+apt);
    pool.query("INSERT INTO address_second values ($1, $2);",
               [code, city], (err, result) => {
      addAddressMain(username, region, city, code, street, apt,res);
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log(result.rows) // brianc

    })

  }

  this.getAddresses = function(username, res){

    pool.query("select address.id, address.region, address.city, address.code, "+
              "address.street, address.unit from address "+
              "inner join client_address on address.id = client_address.address_id "+
              "where username = $1;",
               [username], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.json(JSON.stringify(result.rows));
    })
  }
  this.addPayment = function(username, cardNum, name, expDate, res,returnData){
    console.log(username+" "+cardNum+" "+name+" "+expDate+" ");
    pool.query("INSERT INTO card_info values ($1, $2, $3);",
               [cardNum, name, expDate], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      addClientBilling(cardNum, username, res,returnData);
    })

  }
  this.getPayments = function(username, res){


    pool.query("select card_info.card_number, card_info.name, card_info.expiry_date from card_info "+
              "inner join client_billing on card_info.card_number = client_billing.card_number "+
              "where username = $1;",
               [username], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.json(JSON.stringify(result.rows));
    })
  }

}

module.exports = accountQueries;
