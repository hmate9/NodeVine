var request = require("request"),
querystring = require("querystring"),
JSONbig = require('json-bigint'),
util = require('util'),
settings = require('./settings.js'),
keys = Object.keys(settings.endpoints);

function VineUser(email, password) {
  this.email = email;
  this.password = password;
  this.headers = settings.headers;
}

module.exports = VineUser;

keys.map(function(value, index, arr) {
  var obj = settings.endpoints[value];
  VineUser.prototype[value] = function(params, callback) {
    if (!checkRequired(params, obj.required_params) || !checkRequired(params, obj.url_params)) {
      return giveError('Required params weren\'t present', callback);
    }
    var url = createUrl(obj.endpoint, obj.url_params, params);
    var req = {
      uri: settings.api_url + url + '?' + querystring.stringify(params),
      method: obj.request_type,
      headers: this.headers,
      body: querystring.stringify(params)
    };
    return request(req, handle_response(callback));
  }
});

VineUser.prototype.authenticate=function(callback) {
  var user = this;
  user.login({username:user.email,password:user.password}, function(err, res) {
    if (err) return callback(err);
    var sessionId = res.key;
    user.headers["vine-session-id"] = sessionId;
    return callback(null, res);
  });
}

function handle_response(callback) {
  return function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode != 200) {
      var message = "HTTP Error Code " + res.statusCode + " was returned.";
      return giveError(message, callback);
    }
    if (body) {
      try {
        body = JSONbig.parse(body);
      } catch (e) {
        message = "Response from Vine API is malformed.";
      }
    } else {
      message = "No response from Vine API was received.";
    }
    return callback(null, body.data);
  }
}

/*
Creates the URL, pastes in attributes if needed
*/
function createUrl(endpoint, url_params, params) {
  if (url_params.length == 0) return endpoint;
  var args = [];
  url_params.map(function(value, index, arr) {
    args.push(params[value]);
  });
  args.splice(0, 0, endpoint);
  return util.format.apply(util,args);
}

/*
Makes sure the params obj has everything that is required
*/
function checkRequired(params, required) {
  for (var i in required) {
    var key = required[i];
    if (params[key] === undefined) return false;
  }
  return true;
}

/*
Sends the callback function an error
*/
function giveError(msg, callback) {
  callback(new Error(msg));
}
