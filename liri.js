require(`dotenv`).config();
const fs = require(`fs`);
const axios = require(`axios`);
const moment = require(`moment`);
const Spotify = require(`node-spotify-api`);
const keys = require(`./keys.js`);

const [, , command, ...searchObject] = process.argv

const concertSearch = searchObject => {
  axios.get(`https://rest.bandsintown.com/artists/${searchObject}/events?app_id=codingbootcamp`)
    .then(r => {
      for (let i = 0; i < 10; i++) {
        console.log(`Show #${i + 1}:`)
        console.log(`Venue: ${r.data[i].venue.name}`)
        console.log(`City: ${r.data[i].venue.city}`)
        console.log(`Country: ${r.data[i].venue.country}`)
        console.log(`Date: ${moment(r.data[i].datetime, `YYYY-MM-DD`).format(`MM/DD/YYYY`)}`)
      }
    })
    .catch(e => console.log(e))
}

const spotifySearch = searchObject => {
  keys
    .search({type: `track`, query: `${searchObject}`})
    .then(r => console.log(`this is working`))
    .catch(e => console.log(e))
}

switch (command) {
  case `concert-this`:
    concertSearch(searchObject)
    break
  case `spotify-this-song`:
    spotifySearch(searchObject)
    break
  // case movie-this:
  //   movie(searchObject)
  //   break
  // // case do-what -it-says:
  //   doIt()
  //   break
}