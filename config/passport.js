var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
//var FacebookTokenStrategy= require('passport-facebook-token');
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// passport.use('facebookToken', new FacebookTokenStrategy({
//     clientID: config.oauth.facebook.clientID,
//     clientSecret: config.oauth.facebook.clientSecret
//   }, async (accessToken, refreshToken, profile, done) => {
//     try {
//       console.log('profile', profile);
//       console.log('accessToken', accessToken);
//       console.log('refreshToken', refreshToken);
      
//       const existingUser = await User.findOne({ "facebook.id": profile.id });
//       if (existingUser) {
//         return done(null, existingUser);
//       }
  
//       const newUser = new User({
//         method: 'facebook',
//         facebook: {
//           id: profile.id,
//           email: profile.emails[0].value
//         }
//       });
  
//       await newUser.save();
//       done(null, newUser);
//     } catch(error) {
//       done(error, false, error.message);
//     }
//   }));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({
        min: 4
    });
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({
        'email': email
    }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {
                message: 'Email is already in use.'
            });
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function (err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    })
}));
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({
        'email': email
    }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                message: 'No user found'
            });
        }
        if(!user.validPassword(password)){
            return done(null, false, {
                message: 'Wrong password'
            });

        }
          return done(null,user);
    })
}));