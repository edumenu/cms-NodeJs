//Created by: Edem Dumenu
//Date: 4/16/2018
//Description: This page handles helper functions

module.exports = {
  userAthenticated: function (req, res, next) {
      if(req.isAuthenticated()){
          return next();
      }
      res.redirect('/login');
  }
};