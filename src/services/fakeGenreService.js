/* eslint-disable eqeqeq */
import promiseWithTimeout from '../utils/promiseWithTimeout';

const genres = [
  { id: 1, name: 'Romance' },
  { id: 2, name: 'Action' },
  { id: 3, name: 'Comedy' },
  { id: 4, name: 'Drama' }
];

export function getGenres() {
  return promiseWithTimeout({ data: genres });
}

export function getGenre(id) {
  return promiseWithTimeout({ data: genres.find(g => g.id == id) });
}
