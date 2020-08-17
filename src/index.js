const crypto = require("crypto");
const { compose } = require("ramda");

const verifyOAuthSignature = (request, consumerSecret) => {
  try {
    const {
      body,
      protocol,
      method,
      headers: { host },
      url,
    } = request;

    return compose(
      compareOAuthSignatures(body),
      buildOAuthSignature(consumerSecret),
      replaceOpenParen,
      replaceCloseParen,
      buildAuthString(method)(
        encodeURIComponent(`${protocol}://${host}${url}`)
      ),
      encodeParams,
      buildParams
    )(body);
  } catch (error) {
    console.error("Cannot verify OAuth signature: ", error);
  }
};

const compareOAuthSignatures = (body) => (ourSignature) =>
  decodeURIComponent(body && body.oauth_signature) === ourSignature;

const buildParams = (body) =>
  Object.entries(body)
    .filter(([k, _]) => k !== "oauth_signature")
    .sort(([k_a, _v1], [k_b, _v2]) => k_a.localeCompare(k_b))
    .reduce(
      (acc, [k, v]) => ({
        ...acc,
        [encodeURIComponent(k)]: encodeURIComponent(v),
      }),
      {}
    );

const encodeParams = compose(encodeURIComponent, (params) =>
  Object.entries(params).reduce(
    (acc, [k, v], idx) => (idx === 0 ? `${k}=${v}` : `${acc}&${k}=${v}`),
    ""
  )
);

const buildAuthString = (method) => (encodedUrl) => (encodedParams) =>
  `${method.toUpperCase()}&${encodedUrl}&${encodedParams}`;

const replaceOpenParen = (str) => str && str.replace(/\(/g, "%2528");
const replaceCloseParen = (str) => str && str.replace(/\)/g, "%2529");

const buildEncodedString = (encodedParams) =>
  compose(
    encodeURIComponent,
    Object.entries(encodedParams).reduce((acc, [k, v], idx) =>
      idx === 0 ? `${k}=${v}` : `${acc}&${k}=${v}`
    )
  );

const buildOAuthSignature = (consumerSecret) => (authString) =>
  crypto
    .createHmac("sha1", `${consumerSecret}&`)
    .update(authString)
    .digest()
    .toString("base64");

module.exports = verifyOAuthSignature;
