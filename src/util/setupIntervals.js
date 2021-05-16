const setupIntervals = (client) => {
  setInterval(() => {
    client.autos.get("changeActivity").execute(client);
  }, 300000);
  
  setInterval(() => {
    client.autos.get("getHubbleNews").execute(client, db);
    client.autos.get("spaceX").execute(client, db);
    client.autos.get("fetchVideos").execute(client, db);
    client.autos.get("apod").execute(client, db);
  }, 3600000);
  setInterval(() => {
    client.autos.get("fetchData").execute(db);
  }, 3600000 * 1.2);
  setInterval(() => {
    client.autos.get("spaceFlightNews").execute(client, db);
  }, 3600000 * 4);
}

module.exports = setupIntervals;