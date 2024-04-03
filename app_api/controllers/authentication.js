var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {
  if(!req.body.name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);

  user.save() 
    .then(() => {
      // Log in the user after registration
      req.body.email = req.body.email; 
      req.body.password = req.body.password;
      module.exports.login(req, res); 
    })
    .catch(err => {
      sendJSONresponse(res, 404, err);
    });
};


module.exports.login = function(req, res) {
  console.log("Login request received:", req.body.email); 

  if(!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  passport.authenticate('local', function(err, user, info) {
    console.log("Passport authentication result:", err, user, info);
    var token;

    if (err) {
      sendJSONresponse(res, 404, err);
      return;
    }

    if (user) {
      user.generateJwt()
        .then(token => {
          sendJSONresponse(res, 200, {
            "token": token
          });
        })
        .catch(err => {
          sendJSONresponse(res, 500, err);
        });
    } else {
      sendJSONresponse(res, 401, info);
    }
  })(req, res);

};

module.exports = function(req, res, next) {
  // Get the token from the request headers
  const token = req.headers.authorization;

  // Verify the token
  if (token) {
      // Token found, verify it
      jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
          if (err) {
              // Token verification failed
              console.error('Error verifying token:', err);

              return res.status(401).json({ message: 'Unauthorized' });
          } else {
              console.log('Decoded Token Payload:', decoded);

              // Token is valid, attach user object to request for further processing
              User.findById(decoded._id)
                  .then(user => {
                      req.user = user; // Attach user object to request
                      next(); // Continue to the next middleware or route handler
                  })
                  .catch(err => {
                      console.error('Error finding user by ID:', err);

                      return res.status(401).json({ message: 'Unauthorized' });
                  });
          }
      });
  } else {
      // Token not found
      console.error('No token found in request');

      return res.status(401).json({ message: 'Unauthorized' });
  }
};