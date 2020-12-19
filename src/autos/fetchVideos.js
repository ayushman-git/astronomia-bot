const axios = require("axios");

const getVideos = async function () {
  let rawVideoArr = [];
  const baseURL = "https://youtube.googleapis.com/youtube/v3/playlistItems";
  const playlistID = "PL0pYWShQ46VrbvlFcrnEFKNs7lPxXlKxp";
  let nextPageToken = "";
  do {
    await axios
      .get(
        `${baseURL}?part=snippet&maxResults=50&playlistId=${playlistID}&key=${process.env.YOUTUBE_API}&pageToken=${nextPageToken}`
      )
      .then((res) => {
        if (res.data.nextPageToken) {
          rawVideoArr = rawVideoArr.concat(res.data.items);
          nextPageToken = res.data.nextPageToken;
        } else {
          nextPageToken = "";
          rawVideoArr = rawVideoArr.concat(res.data.items);
        }
      });
  } while (nextPageToken);
  return rawVideoArr;
};

module.exports = {
  name: "fetchVideos",
  description: "Fetch youtube videos",
  async execute(client, db) {
    const videos = await getVideos();
    const videoURLs = videos.map(
      (el) => "https://www.youtube.com/watch?v=" + el.snippet.resourceId.videoId
    );
    const videoRef = db.collection("fetchObjects").doc("videoURL");
    await videoRef.set({
      videoArr: videoURLs,
    });
  },
};
