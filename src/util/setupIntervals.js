const { hoursToMs } = require("../util/helper");

const setupIntervals = (client) => {
  setInterval(() => {
    client.autos.get("changeActivity").execute(client);
  }, hoursToMs(0.1));
  
  setInterval(() => {
    client.autos.get("getHubbleNews").execute(client, db);
    client.autos.get("spaceX").execute(client, db);
    client.autos.get("fetchVideos").execute(client, db);
    client.autos.get("apod").execute(client, db);
  }, hoursToMs(1));
  setInterval(() => {
    client.autos.get("fetchData").execute(db);
  }, hoursToMs(1.2));
  setInterval(() => {
    client.autos.get("spaceFlightNews").execute(client, db);
  }, hoursToMs(4));
}

module.exports = setupIntervals;