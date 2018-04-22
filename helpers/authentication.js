//Created by: Edem Dumenu
//Date: 4/16/2018
//Description: This page handles helper function for authentication

module.exports = {
  userAthenticated: function (req, res, next) {
      //isAuthenticated: In-built function for authentication in passport
      if(req.isAuthenticated()){
          return next();
      }
      res.redirect('/login');
  }
};