meaningful.js
==========

node.js module to help with /valid-path-params-3/just-like-this-4/ all of which are connected to IDs...

## Permalink Problems: solved!

Say you'd like to use permalinks like /photos/{userId}/{photoId}.jpg but you don't want to expose ids, because they're 
ugly and useless to search engines. Meaningful.js can help!

```npm install meaningful

var mf = require("meaningful");

mf.meaningful('Chris Hartwig', 'id-0', function (sanitizedName) {
  // sanitizedName is now Chris-Harwig which you can use in an url
}```

Now imagine your rest api :

```// the url contains the sanitizesName
app.get("/photos/:user", function(req, res) {
  var sanitized = req.params.user;
  
  md.idOfMeaningful(sanitized, function(id) {
    // now you have your id
  }
}```

Does it support collisions? yes, you can have many "values" with different IDs (0-n will be prepended).

Does it support modifications? yes, you can change the user's name, but it will still work with the old name.

## requirements

The only dependency is for Redis... It is used to remember what should point to what...
