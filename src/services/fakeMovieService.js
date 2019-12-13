import { getGenre } from './fakeGenreService';
import promiseWithTimeOut from '../utils/promiseWithTimeout';

/* eslint-disable eqeqeq */
let movies = [
  { id: 1, genreId: 1, title: 'Avengers', genre: 'Romance' },
  { id: 2, genreId: 2, title: 'Endgame', genre: 'Action' },
  { id: 3, genreId: 3, title: 'Pirates of the Caribbean', genre: 'Comedy' },
  { id: 4, genreId: 2, title: 'Terminator', genre: 'Action' },
  { id: 5, genreId: 4, title: 'Frozen', genre: 'Drama' },
  { id: 6, genreId: 1, title: 'Frozen II', genre: 'Romance' }
];

export function getMovies() {
  return promiseWithTimeOut({ data: movies });
}

export async function postMovie(movie) {
  const {
    data: { name: genre }
  } = await getGenre(movie.genreId);

  let id = 0;
  if (movies.length > 0) id = movies[movies.length - 1].id + 1;

  const { title, genreId } = movie;
  const newMovie = {
    id,
    title,
    genreId,
    genre
  };

  movies.push(newMovie);
  return promiseWithTimeOut({ data: newMovie }, 2000);
}

export async function editMovie(id, movie) {
  const movieInDb = movies.find(m => m.id == id);
  if (!movieInDb) return Promise.reject(new Error('Invalid movie.'));

  const {
    data: { name: genre }
  } = await getGenre(movie.genreId);

  movieInDb.genre = genre;
  movieInDb.title = movie.title;
  movieInDb.genreId = movie.genreId;

  return promiseWithTimeOut({ data: movieInDb });
}

export function getMovie(id) {
  const movieInDb = movies.find(m => m.id == id);
  if (!movieInDb) return Promise.reject(new Error('Invalid movie.'));
  return promiseWithTimeOut({ data: movieInDb });
}

export function deleteMovie(id) {
  const movieInDb = movies.find(m => m.id == id);
  if (!movieInDb) return Promise.reject(new Error('Invalid movie.'));

  movies = movies.filter(m => m.id != id);
  return promiseWithTimeOut({ data: id });
}
