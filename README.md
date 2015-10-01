# NodeVine
Complete unofficial Vine API for Node.js

# Installation

#### From NPM

`npm install nodevine`

#### From Source

`npm install`

# Usage

First, we need to **import** this module and **create a user** with a Vine credential.

```js
var Vine = require('nodevine');

var user = new Vine('E-Mail', 'Password');
```

We now have a Vine User, but we have not yet been authenticated. We need to do that before we make any API calls.

```js
user.authenticate(function(err, res) {
  // We can now make API calls
});
```

# Making API calls

The list of available methods and endpoints is available [here](https://github.com/hmate9/NodeVine/blob/master/settings.js).

Simply call the method on the `user` with two parameters:

1. An object with the parameters you wish to pass in
2. Callback function with two arguments: err (error) and res (response)

# Examples

### Getting our account

```js
user.get_me({}, function(err, res) {
  // res is our account
});
```

### Getting someone's followers

```js
user.get_followers({user_id:'1255502149111492608'}, function(err, res) {
  // res is the list of followers
});
```

Note, we are passing the user id in as a string and not as an integer because it is too big.

### Follow someone

```js
user.follow({user_id:'1255502149111492608'}, function(err, res) {
  // we are now following the given vine user
});
```

### Get trending tags

```js
user.get_trending_tags({}, function(err, res) {
  // we have the trending tags
});
```

### Searching for a user

```js
user.search_users({query:'bob'}, function(err, res) {
  // We have our list of matches
});
```

I think you get the idea by now. Check out the [list of available API calls](https://github.com/hmate9/NodeVine/blob/master/settings.js).

MIT Licence
