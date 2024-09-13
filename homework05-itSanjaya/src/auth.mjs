import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// assumes that User was registered in `./db.mjs`
const User = mongoose.model('User');

const startAuthenticatedSession = (req, user, cb) => {
  // TODO: implement startAuthenticatedSession
  req.session.regenerate((err) => {
    if (!err) {
      req.session.user = user; 
      cb();
    } else {
        cb({'message':'Error'});
      }
  });
};

const endAuthenticatedSession = (req, cb) => {
  // TODO: implement endAuthenticatedSession
  req.session.destroy((err) => { cb(err); });
};

const register = (username, email, password, errorCallback, successCallback) => {
  // TODO: implement register
  if((username.length < 8) || (password.length < 8)){
    return errorCallback({'message': 'USERNAME PASSWORD TOO SHORT'});
  }
  else{
    User.findOne({username: username}, (err, result) => { 
      if(!err && result !== null){
        if(result.username === username){
          return errorCallback({'message': 'USERNAME ALREADY EXISTS'});
        }
      }
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(password, salt, function(err, hash) {

              if(err){
                return errorCallback({'message':err});
              }
              const newUser = new User({
                username : username,
                email: email,
                password: hash
              });
    
              try{
                newUser.save(()=>{
                  return successCallback(newUser);
                });
              }catch (e){
                return errorCallback({'message': 'DOCUMENT SAVE ERROR'});
              }
          });
       });
    }); 
  }
};

const login = (username, password, errorCallback, successCallback) => {
  // TODO: implement login
  User.findOne({username: username}, (err, user) => {
    if (!err && user!==null) {
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if(passwordMatch){
          return successCallback(user);
        }
        else{
          return errorCallback({'message':'PASSWORDS DO NOT MATCH'});
        }
      });
    }
    else{
      return errorCallback({'message':'USER NOT FOUND'});
    }
   });
};

// creates middleware that redirects to login if path is included in authRequiredPaths
const authRequired = authRequiredPaths => {
  return (req, res, next) => {
    if(authRequiredPaths.includes(req.path)) {
      if(!req.session.user) {
        res.redirect('/login'); 
      } 
      else {
        next(); 
      }
    } 
    else {
      next(); 
    }
  };
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login,
  authRequired
};
