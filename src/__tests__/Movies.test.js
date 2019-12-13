import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render, cleanup, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Movies from '../components/containers/Movies/Movies';
//import { getMovies } from '../services/fakeMovieService';
import { getMovies } from '../services/movieService';
//import { getGenres } from '../services/fakeGenreService';
import { getGenres } from '../services/genreService';
import { movies, genres } from '../utils/testHelpers';

jest.mock('../services/movieService');
jest.mock('../services/genreService');

describe('Movies Component', () => {
  beforeEach(() => {
    getGenres.mockImplementation(() => Promise.resolve({ data: genres }));
    getMovies.mockImplementation(() => Promise.resolve({ data: movies }));
  });
  
  afterEach(cleanup);

  const setup = () => {
    const history = createBrowserHistory();
    const utils = render(
      <Router history={history}>
        <Movies />
      </Router>
    );
    return { ...utils, history };
  };

  test('Should display error when unable to load genres', async () => {
    getGenres.mockImplementation(() =>
      Promise.reject(new Error('Unable to load data'))
    );

    const { findByTestId } = setup();

    expect(await findByTestId('error-page')).toBeInTheDocument();
  });

  test('Should display error when unable to load movies', async () => {
    getMovies.mockImplementation(() =>
      Promise.reject(new Error('Unable to load data'))
    );

    const { findByTestId } = setup();
    
    expect(await findByTestId('error-page')).toBeInTheDocument();
  });

  test('Should display loading screen when fetching data', async () => {
    const {getByTestId} = setup();

    expect(getByTestId('loading')).toBeInTheDocument();
  });

  test('Should display number of movies in database', async () => {
    const { findByTestId } = setup();
    const container = await findByTestId('movies');

    expect(container.querySelector('p')).toHaveTextContent(movies.length);
  });

  test('Should display list of genres', async () => {
    const { findByTestId } = setup();
    const listGroup = await findByTestId('list-group');

    expect(getGenres).toHaveBeenCalled();
    expect(listGroup.children.length).toBe(genres.length + 1);
  });

  test('Should reset selected genre to all genres when search query changes', async () => {
    const { findByTestId, findByText, findByPlaceholderText } = setup();
    const listGroup = await findByTestId('list-group');
    const searchBox = await findByPlaceholderText(/search/i);
    const allGenresItem = await findByText(/all genres/i);

    fireEvent.click(listGroup.children[2]);
    expect(listGroup.children[2].classList.value).toMatch(/active/i);

    fireEvent.change(searchBox, { target: { value: 'a' } });
    expect(allGenresItem.classList.value).toMatch(/active/i);
  });

  test('Should display list of movies', async () => {
    const { findByTestId } = setup();
    const movieTable = await findByTestId('movie-table');

    expect(getMovies).toHaveBeenCalled();
    expect(movieTable).toHaveTextContent(movies[0].title);
    expect(movieTable.querySelector('tbody').childElementCount).toBe(
      movies.length
    );
  });

  test('Should display add movies prompt when movie database is empty', async () => {
    getGenres.mockImplementation(() => Promise.resolve({ data: genres }));
    getMovies.mockImplementation(() => Promise.resolve({ data: [] }));

    const { findByTestId } = setup();
    const container = await findByTestId('no-movies');

    expect(container).toHaveTextContent(/add/i);
  });

  test('Should redirect to movie form page when adding new movie', async () => {
    const newMovieRoute = '/movies/new';

    const { findByText, history } = setup();
    const link = await findByText(/add movie/i);
    fireEvent.click(link);

    expect(history.location.pathname).toBe(newMovieRoute);
  });

  test('Should redirect to movie form page with correct route when editing movie', async () => {
    const firstMovieRoute = `/movies/${movies[0].id}`;

    const { findByText, history } = setup();
    const firstMovie = await findByText(movies[0].title);
    fireEvent.click(firstMovie);

    expect(history.location.pathname).toBe(firstMovieRoute);
  });
});
