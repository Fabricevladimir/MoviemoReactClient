import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {Button, Table} from 'reactstrap';

import TableHead from '../../common/TableHead/TableHead';
import TableBody from '../../common/TableBody/TableBody';

const MovieTable = props => {
  const { movies, onMovieDelete } = props;

  const columns = [
    {
      label: 'Title',
      path: 'title',
      content: movie => <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
    },
    { label: 'Genre', path: 'genre' },
    {
      key: 'Delete',
      content: movie => (
        <Button
          color="danger"
          size="sm"
          onClick={() => onMovieDelete(movie)}
        >
          Delete
        </Button>
      )
    }
  ];

  return (
    <Table data-testid="movie-table" striped responsive>
      <TableHead columns={columns} />
      <TableBody columns={columns} movies={movies} />
    </Table>
  );
};

MovieTable.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string }))
    .isRequired,
  onMovieDelete: PropTypes.func.isRequired
};

export default MovieTable;
