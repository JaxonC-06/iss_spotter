const needle = require("needle");

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }

    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }

      fetchISSFlyOverTimes(data, (error, times) => {
        if (error) {
          console.log("It didn't work!", error);
          return;
        }

        for (const time of times) {
          console.log(`Next pass at ${new Date(time.risetime * 1000)} for ${time.duration} seconds!`);
        }
      });
    });
  });
};

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

const fetchISSFlyOverTimes = function(geoCoords, callback) {
  needle.get(`https://iss-flyover.herokuapp.com/json/?lat=${geoCoords.latitude}&lon=${geoCoords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status code is ${response.statusCode} when fetching coordinates. Server message is: ${body}`;
      callback(Error(msg), null);
      return;
    }

    return callback(null, body.response);
  });
};

module.exports = { nextISSTimesForMyLocation };