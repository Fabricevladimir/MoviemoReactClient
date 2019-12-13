import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import MovieForm from '../components/containers/MovieForm/MovieForm';
import { postMovie, editMovie, getMovie } from '../services/movieService';

jest.mock('../services/movieService');
jest.mock('../services/genreService', () => {
  const genres = [
    { id: 1, name: 'Romance' },
    { id: 2, name: 'Action' },
    { id: 3, name: 'Comedy' },
    { id: 4, name: 'Drama' }
  ];
  return { getGenres: () => Promise.resolve({ data: genres }) };
});

const validGenreId = 1;
const invalidGenreId ='';
const validMovieTitle = 'abc';
const invalidMovieTitle = 'a';
const movie = { id: 1, genreId: 1, title: 'Avengers', genre: 'Romance' };

getMovie.mockImplementation(() => Promise.resolve({ data: movie }));
editMovie.mockImplementation(() => Promise.resolve({}));
postMovie.mockImplementation(() => Promise.resolve({}));

describe('MovieForm Component', () => {
  afterEach(cleanup);

  const setup = (id=1) => {
    const history = createBrowserHistory();
    const match = { params: { id } };

    const utils = render(
      <Router history={history}>
        <MovieForm history={history} match={match} />
      </Router>
    );
    return { ...utils, history };
  };

  test('Should display loading screen when loading data', async () => {
    const { findByTestId } = setup();
    const loader = await findByTestId('loading');
    expect(loader).toBeVisible();
  });

  test('Should display title input', async () => {
    const { findByLabelText } = setup();
    const input = await findByLabelText(/movie title/i);
    expect(input).toBeInTheDocument();
  });

  test('Should display genre select', async () => {
    const { findByLabelText } = setup();
    const select = await findByLabelText(/genre/i);
    expect(select).toBeInTheDocument();
  });

  test('Should display submit button', async () => {
    const { findByText } = setup();
    const submitButton = await findByText(/submit/i);
    expect(submitButton).toBeInTheDocument();
  });

  test('Should fill out form when editing movie', async () => {
    // Note that the movieId is set to 1 in setup fixture
    const { findByLabelText } = setup();
    const titleInput = await findByLabelText(/movie title/i);
    const genreSelect = await findByLabelText(/genre/i);

    expect(titleInput.value).toBe(movie.title);
    expect(genreSelect.value).toBe(movie.genreId.toString());
  });

  test('Should set input to invalid when title given is invalid', async () => {
    const { findByLabelText } = setup();
    let titleInput = await findByLabelText(/movie title/i);
    
    fireEvent.change(titleInput, { target: { value: invalidMovieTitle } });
    titleInput = await findByLabelText(/movie title/i);
    
    expect(titleInput).not.toBeValid();
  });
  
  // TODO - test for not being able to submit before filling out properly
  test('Should set input to valid when title given is valid', async () => {
    const { findByLabelText } = setup();
    let titleInput = await findByLabelText(/movie title/i);
    
    // Invalid value
    fireEvent.change(titleInput, { target: { value: invalidMovieTitle } });
    titleInput = await findByLabelText(/movie title/i);
    expect(titleInput).not.toBeValid();
    
    // Valid value
    fireEvent.change(titleInput, { target: { value: validMovieTitle } });
    titleInput = await findByLabelText(/movie title/i);
    
    expect(titleInput).toBeValid();
  });

  test('Should set select to invalid when genre not selected', async () => {
    const {findByLabelText} = setup();
    let genreSelect = await findByLabelText(/movie genre/i);

    fireEvent.change(genreSelect, {target: { value: invalidGenreId}});
    genreSelect = await findByLabelText(/movie genre/i);
  
    expect(genreSelect).not.toBeValid();
  });

  test('Should set select to valid when valid genre selected', async () => {
    const {findByLabelText} = setup();
    let genreSelect = await findByLabelText(/movie genre/i);

    // Genre not selected
    fireEvent.change(genreSelect, {target: { value: invalidGenreId}});
    genreSelect = await findByLabelText(/movie genre/i);
    expect(genreSelect).not.toBeValid();

    fireEvent.change(genreSelect, {target: { value: validGenreId}});
    genreSelect = await findByLabelText(/movie genre/i);

    expect(genreSelect).toBeValid();
  });
  
  test('Should not save movie when title is invalid', async ()=> {
    const {findByLabelText, findByText} = setup();
    let titleInput = await findByLabelText(/movie title/i);
    let genreSelect = await findByLabelText(/movie genre/i);

    fireEvent.change(titleInput, {target: {value: invalidMovieTitle}});
    fireEvent.change(genreSelect, {target: {value: validGenreId}});
    fireEvent.click( await findByText(/submit/i));
    
    titleInput = await findByLabelText(/movie title/i);
    genreSelect = await findByLabelText(/movie genre/i);
    
    expect(genreSelect).toBeValid();
    expect(titleInput).not.toBeValid();
    expect(postMovie).not.toBeCalled();
  });
  
  test('Should not save movie when genre is invalid', async ()=> {
    const {findByLabelText, findByText} = setup();
    let titleInput = await findByLabelText(/movie title/i);
    let genreSelect = await findByLabelText(/movie genre/i);
    
    fireEvent.change(titleInput, {target: {value: validMovieTitle}});
    fireEvent.change(genreSelect, {target: {value: invalidGenreId}});
    fireEvent.click( await findByText(/submit/i));
    
    titleInput = await findByLabelText(/movie title/i);
    genreSelect = await findByLabelText(/movie genre/i);
    
    expect(titleInput).toBeValid();
    expect(genreSelect).not.toBeValid();
    expect(postMovie).not.toBeCalled();
  });
  
  test('Should redirect to movies page when form submits successfully', async () => {
    const moviesPagePathName ="/movies";
    const {findByLabelText, findByText, history} = setup();
    const genreSelect = await findByLabelText(/movie genre/i);
    let titleInput = await findByLabelText(/movie title/i);
    
    fireEvent.change(titleInput, {target: {value: validMovieTitle}});
    fireEvent.change(genreSelect, {target: {value: validGenreId}});
    fireEvent.click( await findByText(/submit/i));

    titleInput = await findByLabelText(/movie title/i);
    expect(history.location.pathname).toBe(moviesPagePathName);
  });
});
