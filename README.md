# Moviemo Client (React.js)
JavaScript application that manages movies in a database.

## Getting Started
* Clone this repo
* `npm install` to install all required dependencies
* `npm start` to start the local server

Other commands can be found in `package.json` (this project uses create-react-app)

### Making requests to the backend API
While the application is able to fake API calls, the source code for a backend server can be found in [the MoviemoApi repo](https://github.com/Fabricevladimir/MoviemoApi).

To configure the application to use the API server:
* Edit `src/config.json` and change `apiUrl` to match the server's url. 
* Comment out the import statements for `fakeGenreService` and `fakeMovieService` in `src/components/containers/Movies/Movies.jsx` and uncomment the ones for `genreService` and `movieService`.
* Repeat the previous step in `src/components/containers/MovieForm/MovieForm.jsx` as well.

## Functionality Overview
This application manages movies in a database. It uses an ASP.NET Core Web API backend for all requests.

**General functionality:**
* Add, edit, and delete movies
* Retrieve and display movies in a paginated list
* Search for movies by title
* Sort movies by genre
