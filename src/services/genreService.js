import { apiUrl } from '../config.json';
import http from './httpService';

// eslint-disable-next-line import/prefer-default-export
export function getGenres() {
  return http.get(`${apiUrl}/genres`);
}
