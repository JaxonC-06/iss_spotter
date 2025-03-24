const needle = require('needle');

const fetchMyIP = () => {
  return needle('get', 'https://api.ipify.org?format=json')
    .then((response) => {
      return response.body.ip;
    });
};

const fetchCoordsByIP = function(ip) {
  return needle('get', `http://ipwho.is/${ip}?output=json`)
    .then((response) => {
      const coords = {latitude: response.body.latitude, longitude: response.body.longitude};
      return coords;
    });
};

const fetchISSFlyOverTimes = function(coords) {
  return needle('get', `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`)
    .then((response) => {
      return response.body.response;
    });
};

const nextISSTimesForMyLocation = function() {
  fetchMyIP()
    .then((ip) => fetchCoordsByIP(ip))
    .then((coords) => fetchISSFlyOverTimes(coords))
    .then((times) => {
      for (const time of times) {
        console.log(`Next pass at ${new Date(time.risetime * 1000)} for ${time.duration} seconds!`);
      }
    })
    .catch((error) => {
      console.log("It didn't work: ", error.message);
    });
};

module.exports = { nextISSTimesForMyLocation };