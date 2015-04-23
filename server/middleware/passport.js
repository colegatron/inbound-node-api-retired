var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

/* Generate API key */
function CreateAPIKey(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split(''),
    str = '';
    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

module.exports = function(passport){

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // login
  passport.use('login', new LocalStrategy({
      usernameField: 'email',
      passReqToCallback : true
    },
    function(req, email, password, done) {

      User.findOne({ 'email' :  email },
        function(err, user) {
          if (err) return done(err);
          if (!user){
            return done(null, false, req.flash('error', 'User not found'));
          }
          user.comparePassword(password, function(err, isMatch) {
            if (isMatch) {
              var time = 14 * 24 * 3600000;
              req.session.cookie.maxAge = time; //2 weeks
              req.session.cookie.expires = new Date(Date.now() + time);
              req.session.touch();
              return done(null, user, req.flash('success', 'Successfully logged in.'));
            } else {
              return done(null, false, req.flash('error', 'Invalid Password'));
            }
          });
        }
      );
    })
  );

  passport.use('signup', new LocalStrategy({
      usernameField: 'email',
      passReqToCallback : true
    },
    function(req, email, password, done) {
      var findOrCreateUser = function(){
        User.findOne({ email: req.body.email }, function(err, existingUser) {
          if (existingUser) {
            req.flash('form', {
              email: req.body.email
            });
            return done(null, false, req.flash('error', 'An account with that email address already exists.'));
          }
           
          //console.log("[passport.findOrCreateUser] req.cookies.affliateReferredById = " + req.cookies.affliateReferredById);
    
    /*
          var affrefVal = null;
          if( req.cookies.affliateReferredById ){
            affrefVal = req.cookies.affliateReferredById;
          }
    */

          var user = new User({
            email: req.body.email,
            password: req.body.password, // user schema pre save task hashes this password
            api_pubKey: CreateAPIKey(32),
            api_privateKey: CreateAPIKey(43),
            ref_token: CreateAPIKey(5),
            affliateReferredBy: req.cookies.affliateReferredById,
            status: "signed_up"
          });
          
          user.save(function(err) {
            if (err) return done(err, false, req.flash('error', 'Error saving user.'));
            var time = 14 * 24 * 3600000;
            req.session.cookie.maxAge = time; //2 weeks
            req.session.cookie.expires = new Date(Date.now() + time);
            req.session.touch();
            return done(null, user, req.flash('success', 'Thanks for signing up!!'));
          });
        });
      };

      process.nextTick(findOrCreateUser);

    })
  );
};
