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
  async execute(db) {
    const flightData = await fetchUpcomingFlights();
    const eventData = await fetchEvents();

    const APIDataRef = db.collection("fetchObjects").doc("APIData");
    APIDataRef.set({ flights: JSON.stringify(flightData) }, { merge: true });
    APIDataRef.set({ events: JSON.stringify(eventData) }, { merge: true });

    // //to be deleted
    // const finalAstronautData = await fetchAstronauts();
    // fs.appendFile("./src/assets/astronautsData.js", JSON.stringify(finalAstronautData), () => {
    //   console.log("Astronauts updated");
    // });
  },
};
