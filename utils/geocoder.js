const nodeGeocoder = require('node-geocoder')

const geocoder = nodeGeocoder({
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "Py17eACHbxGn1y5Fsy8w2xCbewGzCJ78",
  formatter: null,
});

module.exports = geocoder;