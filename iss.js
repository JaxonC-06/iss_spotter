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

module.exports = { fetchMyIP };