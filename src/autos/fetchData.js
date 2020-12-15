const fs = require("fs");
const axios = require("axios");
const fetchUpcomingFlights = () => {
  return axios
    .get("https://ll.thespacedevs.com/2.0.0/launch/upcoming")
    .then((res) => res.data.results);
};

const fetchEvents = () => {
  return axios
    .get("https://ll.thespacedevs.com/2.0.0/event/upcoming/")
    .then((res) => res.data.results);
};

// const fetchAstronauts = (astronautName) => {
//   return axios
//     .get(`https://ll.thespacedevs.com/2.0.0/astronaut/?limit=100&offset=600`)
//     .then((res) => res.data.results);
// };

module.exports = {
  name: "fetchData",
  description: "Fetch Data",
  async execute() {
    const flightData = await fetchUpcomingFlights();
    const eventData = await fetchEvents();
    //flight data
    const flightDataStringified = JSON.stringify(flightData);
    const finalFlightData = "module.exports=" + flightDataStringified;
    fs.writeFile("./src/assets/flightData.js", finalFlightData, () => {
      console.log("Upcoming Flights updated");
    });

    //event data
    const eventDataStringified = JSON.stringify(eventData);
    const finalEventData = "module.exports=" + eventDataStringified;
    fs.writeFile("./src/assets/eventData.js", finalEventData, () => {
      console.log("Upcoming Events updated");
    });

    fs.readFile("./src/assets/flightData.js", (err, data) => {
      console.log(String(data));
    });

    // //to be deleted
    // const finalAstronautData = await fetchAstronauts();
    // fs.appendFile("./src/assets/astronautsData.js", JSON.stringify(finalAstronautData), () => {
    //   console.log("Astronauts updated");
    // });
  },
};
