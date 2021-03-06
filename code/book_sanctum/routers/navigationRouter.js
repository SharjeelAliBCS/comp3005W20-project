let express = require('express');
let serverData = require('../data');
let navigationQueries = require("../sqlQueries/navigationQueries");

let navigationQueryInstance = new navigationQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);
  router.get('/genres', getGenres);
  router.get('/logout', logout);

  function logout(req, res, next){
    delete serverData.users[req.sessionID];
    res.redirect("/client_home");
  }
  function get(req, res, next) {
    console.log("nav router says sessionid is " + req.sessionID)
    if(req.sessionID in serverData.users){
      res.json(serverData.users[req.sessionID].user);
    }
    else{
      res.json('');
    }
  }

  function getGenres(req,res,next){
    navigationQueryInstance.getGenres(res);
  }


  return router;
}
