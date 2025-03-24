const needle = require("needle");

const fetchMyIP = function(callback) {
  needle.get('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching IP. Response: ${body.ip}`;
      callback(Error(msg), null);
      return;
    }

    return callback(null, body.ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  needle.get(`http://ipwho.is/${ip}?output=json`, (error, response, body) => {
    if (error) {
      callback(error, null);
    }

    if (!body.success) {
      const msg = `Status success was ${body.success} when fetching for IP ${body.ip}. Server message is: ${body.message}`;
      callback(Error(msg), null);
      return;
    }

    const geoCoords = {latitude: body.latitude, longitude: body.longitude};

    return callback(null, geoCoords);
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };