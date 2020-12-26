![enter image description here](https://miro.medium.com/max/2000/1*rvh7SsihchvuR0Y77itWVw.jpeg)

Let’s start by talking about  **astronomia.**  Astronomia is a discord bot that can provide news, give information about celestial objects, suggest random movies and a lot more. You can go to  [this site](https://ayushman-git.github.io/astronomia-site/)  to explore all its command.

The astronomia project was perhaps the most exciting project that I worked on. It’s because of two reasons — first, I got something to build that includes astronomy and astronomy always gets me hyped up; the other reason being I get to use so many technologies in a single project. I used several APIs to get data and if there was no API I scrapped data with  **puppeteer**. I also used  **firestore** for some cool stuff and finally  **discord.js** npm module to interact with Discord. I’ll talk about all those technologies and how it helped me to build astronomia.
## What is discord.js?

![enter image description here](https://miro.medium.com/max/875/1*sC1_F3ZD4dVXWPrzPSovrg.png)

Before diving into discord.js, let me briefly explain  **Discord**. Discord is basically slack, but marketed towards gamers, though it can be used by anyone who wants to hang out with their friends online. Users can chat with each other in text channels or join voice channels to talk with other members.

With that out of the way, let’s talk about  [**discord.js**](https://discord.js.org/#/). Discord.js is a npm package that interacts with discord API. It is based on Event-Driven Architecture, so if any user on the discord sends a message, that message can be caught in the discord.js API. It is not limited to messages, we can catch almost every activity like — user joining server, reactions to messages, text channel creation and much more. It is also possible to make a bot do anything that a server’s owner is capable of (except server deletion) given bot have proper permissions.

## How Discord bot works?

Let’s take a minute to understand how a discord bot works.

![enter image description here](https://miro.medium.com/max/1250/1*xxIJOSJbuUcUtSxzCvtYCw.jpeg)

So user enters a message in the discord client, then that message is sent to our server via discord API, where our bot is hosted. The server then executes some codes based on the command sent by the user.

Here we will take example of  **.hi** command of our bot. Whenever user types  **.hi** is discord, an event is emitted by the discord API which we catch with —

    client.on('message',  someCodeToRun);
The first challenge is to determine whether the message sent was a regular message or a command meant for  **astronomia bot**.  So I wrote a condition which ignores anything that don’t start with a  **“.”,** which is a prefix that I picked.

After detecting its a command meant for the bot, I’m breaking down the message into command name and argument. The first letter after  **“.”**  is considered as a command and everything after that is converted into an array which will be used as arguments for commands.

After detecting its a command meant for the bot, I’m breaking down the message into command name and argument. The first letter after  **“.”**  is considered as a command and everything after that is converted into an array which will be used as arguments for commands.

So when user enter  **.hi**. At server side, bot is randomly selecting a greeting word from an array that I created and it gets sent back to the user via discord API.

![enter image description here](https://miro.medium.com/max/875/1*G5QJIy4ADLZMPnajD8LFwg.gif)

If we look at the whole concept, it’s not that complicated. I’m identifying commands sent by the user and executing a specific function which returns the processed message back. But what happens when astronomia don’t have data that the user is requesting for? It gets a little complicated when we have to fetch data to send it back to the user.

## Getting data
In the previous section, we explored a simple  **.hi** command, which honestly is not that interesting. In this section we will talk about two more commands —  **.explore** and  **.wallpaper.**  These commands are little bit more intriguing to understand.

The  **.explore** command takes an argument. So a proper syntax would look something like this —  **.explore titan**  and it will return this as response.

![enter image description here](https://miro.medium.com/max/875/1*1uE5hlKQdN2WzF2MMQv6Ig.gif)

So what’s going on here? Actually a few things. Let’s break it down. As soon as user sends this command, bot is making a **GET** request to [The Solar System OpenData](https://api.le-systeme-solaire.net/en/) API, which is an API containing data about celestial objects in our solar system. After identifying the explore command, astronomia is sending a request to that API which responds back with JSON data about Titan moon. This JSON data looks something like this.

```
{
"id": "titan",
"name": "Titan",
"englishName": "Titan",
"isPlanet": false,
"moons": null,
"semimajorAxis": 1221865,
"perihelion": 1186680,
"aphelion": 1257060,
"eccentricity": 0.0292,
"inclination": 0.33,
"mass": {
"massValue": 1.3452,
"massExponent": 23
},
"vol": {
"volValue": 0,
"volExponent": 0
},
"density": 1.88,
"gravity": 0,
"escape": 0,
"meanRadius": 2575,
"equaRadius": 0,
"polarRadius": 0,
"flattening": 0,
"dimension": "",
"sideralOrbit": 15.95,
"sideralRotation": 382.8,
"aroundPlanet": {
"planet": "saturne",
"rel": "https://api.le-systeme-solaire.net/rest/bodies/saturne"
},
"discoveredBy": "Christian Huygens",
"discoveryDate": "25/03/1655",
"alternativeName": "",
"axialTilt": 0
}
```

It contains all cool stuff, but there are two things missing — image of titan and a brief description. To add these two data, I manually collected images and description from internet for well-known celestial objects which included all eight planets, sun and few popular moons and stored them in a JSON file.

So whenever a user hits  **.explore titan** command, the bot is fetching data from API as well as taking data locally from the JSON file and returning the proper message with all sorts of data.

Until now, we have only used APIs to fetch data, but what are we supposed to do when there’s no API or there’s some restrictions in using API. That was the case when I was implementing the wallpaper feature.

[Wallpaperscaft](https://wallpaperscraft.com/catalog/space)  have some great astronomy wallpapers, but they had limited requests for API calls and some CORS restrictions. So I installed puppeteer, which is a npm package for scrapping data with chrome and scrapped all the wallpaper’s URL related to astronomy.

```
const fs = require("fs");
const url = "https://wallpaperscraft.com/catalog/space/1920x1080/page";
const fileName = "wallpaperUrl.js";
const pages = 85
const puppeteer = require("puppeteer");
(async () => {
const finalUrl = [];
for (let i = 1; i <= pages; i++) {
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(
url + i,
{
waitUntil: "networkidle2",
timeout: 0,
}
);
const result = await page.evaluate(() => {
let url = [];
document.querySelectorAll(".wallpapers__image").forEach((image) => {
url.push(image.currentSrc);
});
return url;
});
result.forEach((url) => {
url = url.replace("300", "1920");
url = url.replace("168", "1080");
finalUrl.push(url);
});
let finalUrlString = JSON.stringify(finalUrl);
fs.writeFile(fileName, finalUrlString, () => {
console.log("Added page - ", i);
});
await browser.close();
}
})();
```

This small script made it possible to collect 1200+ wallpaper URLs. Let’s break the above code to have a better understanding.

I’m importing  **fs** modules as I’ll be storing the fetched URLs in a file. The second module is  **puppeteer**  which I’m using inside an async function. Puppeteer features must be used inside an async function because it takes some time to complete tasks like — opening chrome, opening tab etc.

Then I’m using loop to traverse through each page. On line 11 and 12, I’m launching chrome and creating a new tab. After that, I’m going to the URL provided.

From line 20 to 26,  **evaluate()** function is returning the URLs of wallpapers on that page and storing it in  **const result**. Then I’m making some adjustments to the URL to lead to the correct path. Finally I’m storing these URLs in wallpaperUrl.js file using  **fs.writeFile()**. Now I can use these 1200+ wallpapers and send it to users.

## Auto Functions

Every command that I explained till now executes a piece of code after user enters a certain commands. But for something like news updates, a function should be executed periodically. Let’s explore these auto functions.

![enter image description here](https://miro.medium.com/max/1250/1*Aixf4bct7EmvUQPtpBEl0g.jpeg)

With **setInterval()** functions, I’m passing a callback function. That callback function makes a request to the [hubble site API](http://hubblesite.org/api/documentation) every hour, after getting the response I’m checking whether the JSON received is the same as JSON stored in the firestore DB. If it’s the same then the function will return and do nothing else. But if there’s a difference between the JSON received and the JSON in firestore, it will process that data and sends it back to the Discord. Finally the JSON stored in firestore will be replaced with the JSON that was fetched with axios. This whole process repeats every 60 minutes and that’s how users get the latest news.

## Conclusion

It’s only the beginning, I’ve plans to scale up this bot and add lots of new commands and features. If you have some ideas, please share them with me.

This idea was started as another week-long project. But I kept coming back to it to add new features or to improve upon existing ones. This project helped me to explore unexplored territories and helped me to face real-world problems like — what should we do when there’s no API for a service, how to host nodeJs apps and a lot more. This project also has its challenges, for example it took me a full day to figure out how to scrape data for quotes from goodreads.

You can visit this  [**site**](https://ayushman-git.github.io/astronomia-site/)  to explore more about the bot or you can  [contribute](https://github.com/ayushman-git/astronomia-bot) in this project. If you love astronomy you will love this bot. I’ll end this article with one of my favorite quote.

> “”The cosmos is all that is or ever was or ever will be. Our feeblest contemplations of the Cosmos stir us — there is a tingling in the spine, a catch in the voice, a faint sensation, as if a distant memory, or falling from a height. We know we are approaching the greatest of mysteries.” — Carl Sagan
