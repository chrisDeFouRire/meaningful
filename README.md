meaningful.js
==========

This node.js module will help with `/valid-path-params-3/just-like-that-4/` . With meaningful, it's easy to use meaningful path names instead of IDs.

## Permalink Problems: solved!

Say you'd like to use permalinks like `/photos/{userId}/{photoId}.jpg` but you don't want to expose ids, because they're
ugly and useless to search engines. Meaningful.js can help!

```
npm install meaningful
```

```JavaScript
var mf = require("meaningful");
mf.meaningful('Chris Hartwig / amazing user', myUserId, function (sanitizedName) {
  // sanitizedName is now "Chris-Hartwig-amazing-user" which you can use in the url
}
```

Now imagine your rest api :

```JavaScript
// the url contains the sanitizedName
app.get("/photos/:user", function(req, res) {
  var sanitized = req.params.user; // sanitized == "Chris-Hartwig-amazing-user"
  mf.idOfMeaningful(sanitized, function(id) {
    // now you have your id (same as myUserId)
  }
}
```

Does it support collisions? yes, you can have many "values" with different IDs (automatic numerical suffix).
So if another 'Chris Hartwig / amazing user' registers (with a different user id), his meaningful name will be Chris-Hartwig-amazing-user-1

Does it support modifications? yes, if 'Chris Hartwig / amazing user' changes to a less radical 'Chris Hartwig', the new and the old url will point to the same userId to avoid 404s.

## requirements

The only dependency is for Redis...

You can customize the way you connect to Redis:

```JavaScript
var mf = require('meaningful');

var client = md.createClient(myVerySpecialURL);
mf.getClient = function () { // let's overload getClient
    return client;
};
```

## TODO's

- [ ] Maybe I should add a real life example
- [ ] There's no error handling at all
- [ ] More tests are needed (mocha)
- [ ] Someone should benchmark that thing

