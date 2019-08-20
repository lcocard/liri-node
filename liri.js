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
        queryThis(value);
        break;
};

function concert(value) {
    axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var datetime = response.data[i].datetime;
                var concertResults =
                    "--------------------------------------------------------------------" +
                    "\nVenue Name: " + response.data[i].venue.name +
                    "\nVenue Location: " + response.data[i].venue.city +
                    "\nDate of the Event: " + moment(datetime).format("MM/DD/YYYY");

                console.log(concertResults);
            }
        })
        .catch(function (error) {
            console.log('Band/Artist not found : ' + value);
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
                    "\nPreview Link: " + response.tracks.items[i].preview_url +
                    "\nAlbum Name: " + response.tracks.items[i].album.name;
                console.log(spotifyResults);
            }
        })
        .catch(function (err) {
            //console.log(err);
            console.log('Song not found : ' + value);
        });
}

function omdb(value) {
    if (!value) {
        value = "mr nobody";
    }
    axios.get("https://www.omdbapi.com/?t=" + value + "&y=&plot=long&apikey=trilogy")
        .then(function (response) {
            var movieResults =
                "--------------------------------------------------------------------" +
                "\nMovie Title: " + response.data.Title +
                "\nYear of Release: " + response.data.Year +
                "\nIMDB Rating: " + response.data.imdbRating +
                "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                "\nCountry Produced: " + response.data.Country +
                "\nLanguage: " + response.data.Language +
                "\nPlot: " + response.data.Plot +
                "\nActors/Actresses: " + response.data.Actors;
            console.log(movieResults);
        })
        .catch(function (error) {
            //console.log(error);
            console.log('Movie not found : ' + value);
        });
}

function queryThis(value) {
    fs.readFile("random.txt", "UTF8", (err, data) => {
        if (err) throw err;
        var queryValue = data.split(",")[1];
        var queryCommands = data.split(",")[0];

        switch (queryCommands) {
            case "concert-this":
                concert(queryValue);
                break;
            case "spotify-this-song":
                spot(queryValue);
                break;
            case "movie-this":
                omdb(queryValue);
                break;
        };

    });
}