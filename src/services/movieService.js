import { apiUrl } from '../config.json';
import http from './httpService';

const urlEndPoint = `${apiUrl}/movies`;

export function getMovies(cancelToken) {
  return http.get(urlEndPoint, { cancelToken });
}

export function postMovie(movie, cancelToken) {
  return http.post(urlEndPoint, movie, { cancelToken });
}

export function editMovie(id, movie, cancelToken) {
  return http.put(`${urlEndPoint}/${id}`, movie, { cancelToken });
}

export function getMovie(id, cancelToken) {
  return http.get(`${urlEndPoint}/${id}`, { cancelToken });
}

export function deleteMovie(id, cancelToken) {
  return http.delete(`${urlEndPoint}/${id}`, { cancelToken });
}
