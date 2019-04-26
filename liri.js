require(`dotenv`).config();
const fs = require(`fs`);
const axios = require(`axios`);
const moment = require(`moment`);
const Spotify = require(`node-spotify-api`);
const spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET,
})
// const keys = require(`./keys.js`);

const [, , command, ...searchObject] = process.argv
let searchTerm = searchObject.join(``)

const concertSearch = search => {
  axios.get(`https://rest.bandsintown.com/artists/${search}/events?app_id=codingbootcamp`)
    .then(r => {
      if (r.data[0] === undefined) {
        console.log(`${searchTerm} has no upcoming shows :(`)
      } else {
        for (let i = 0; i < r.data.length; i++) {
          console.log(`---------------------------------------------------------------------`)
          console.log(`Show #${i + 1}:`)
          console.log(`Venue: ${r.data[i].venue.name}`)
          console.log(`City: ${r.data[i].venue.city}`)
          console.log(`Country: ${r.data[i].venue.country}`)
          console.log(`Date: ${moment(r.data[i].datetime, `YYYY-MM-DD`).format(`MM/DD/YYYY`)}`)
        }
      }
    })
    .catch(e => console.log(e))
}

const spotifySearch = searchObject => {
  axios.get(`https://api.spotify.com/v1/search?q=track:${searchObject}&type=track&limit=10`)
    .then(r => {
      console.log(`success`)
    })
    .catch(e => console.error(e))
}

const omdbSearch = searchObject => {
  if (searchObject[0] === undefined) {
    axios.get(`http://www.omdbapi.com/?apikey=28955a43&t=mr.nobody`)
      .then(r => {
        console.log(`---------------------------------------------------------------------`)
        console.log(`Title: ${r.data.Title}`)
        console.log(`Year: ${r.data.Year}`)
        console.log(`IMDB Rating: ${r.data.imdbRating}`)
        console.log(`Rotten Tomatoes Rating: ${r.data.Ratings[1].Value}`)
        console.log(`Country: ${r.data.Country}`)
        console.log(`Language: ${r.data.Language}`)
        console.log(`Plot: ${r.data.Plot}`)
        console.log(`Starring: ${r.data.Actors}`)
      })
      .catch(e => console.error(e))
  } else {
    axios.get(`http://www.omdbapi.com/?apikey=28955a43&t=${searchObject}`)
      .then(r => {
        if (r.data.Title === undefined) {
          console.log(`---------------------------------------------------------------------`)
          console.log(`Please enter a valid movie title! `)
        } else {
          console.log(`---------------------------------------------------------------------`)
          console.log(`Title: ${r.data.Title}`)
          console.log(`Year: ${r.data.Year}`)
          console.log(`IMDB Rating: ${r.data.imdbRating}`)
          console.log(`Rotten Tomatoes Rating: ${r.data.Ratings[1].Value}`)
          console.log(`Country: ${r.data.Country}`)
          console.log(`Language: ${r.data.Language}`)
          console.log(`Plot: ${r.data.Plot}`)
          console.log(`Starring: ${r.data.Actors}`)
        }
      })
      .catch(e => console.error(e))
  }
}

const doIt = () => {
  fs.readFile(`random.txt`, `utf8`, (e, data) => {
    let newArr = (data.split(`,`))
    let [command, searchObject] = newArr
    switch (command) {
      case `concert-this`:
        let searchArr = searchObject.split(`, `)
        newTerm = searchArr.join(``)
        concertSearch(newTerm)
        break
      // case `spotify-this-song`:
      //   spotifySearch(searchObject)
      //   break
      case `movie-this`:
        omdbSearch(searchObject)
        break
      case `do-what-it-says`:
        doIt()
        break
    }
  })
}

switch (command) {
  case `concert-this`:
    concertSearch(searchTerm)
    break
  // case `spotify-this-song`:
  //   spotifySearch(searchObject)
  //   break
  case `movie-this`:
    omdbSearch(searchObject)
    break
  case `do-what-it-says`:
    doIt()
    break
}