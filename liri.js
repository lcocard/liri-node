require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);
moment().format();

var commands = process.argv[2];
var value = process.argv[3];

switch (commands) {

}


switch (commands) {
    case "concert-this":
        concert(value);
        break;
    case "spotify-this-song":
        spot(value);
        break;
    case "movie-this":
        omdb(value);
        break;
    case "do-what-it-says":
        doThis(value);
        break;
};

function concert(value) {
    axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var datetime = response.data[i].datetime;
                var dateArr = datetime.split('T');
                var concertResults =
                    "--------------------------------------------------------------------" +
                    "\nVenue Name: " + response.data[i].venue.name +
                    "\nVenue Location: " + response.data[i].venue.city +
                    "\nDate of the Event: " + moment(dateArr[0]).format("MM/DD/YYYY");
                console.log(concertResults);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function spot(value) {

    if (!value) {
        value = "The Sign";
    }
    spotify
        .search({ type: 'track', query: value })
        .then(function (response) {
            for (var i = 0; i < 5; i++) {
                var spotifyResults =
                    "--------------------------------------------------------------------" +
                    "\nArtist(s): " + response.tracks.items[i].artists[0].name +
                    "\nSong Name: " + response.tracks.items[i].name +
                    "\nAlbum Name: " + response.tracks.items[i].album.name +
                    "\nPreview Link: " + response.tracks.items[i].preview_url;
                console.log(spotifyResults);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}
