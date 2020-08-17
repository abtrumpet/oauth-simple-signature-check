### oauth-simple-signature-check
This package is a simple way to quickly test an OAuth 1.0a signature for validity. As it is intended to be extremely simple, there are no configuration options; however, you may use it as a base if you need different behavior. The algorithm for validating OAuth signatures was adapted from this site: http://lti.tools/oauth/

It was originally designed to simplify OAuth signature validation within the LTI (Learning Tools Interopability) spec, but it can be adapted to many other uses as well.

## Assumptions
The package works out-of-the-box with Express.js.

The algorithm assumes you are using HMAC-SHA1 within the OAuth 1.0a spec. Again, you can fork this package and easily change this, if needed. It also assumes you are using UTF-8 for encoding (which you should be).

## How to use
Call it in your express.js app, within a route. Here is an example:
```
const validateOAuthSignature = require("oauth-simple-signature-check");

app.post("/", function (req, res) => {
  const isOAuthSignatureValid = validateOAuthSignature(req, process.env.CONSUMER_SECRET); 

  if (isOAuthSignatureValid)
    res.json({ data: {str: "my secret string"} });
  else
    res.json({});
}); 
