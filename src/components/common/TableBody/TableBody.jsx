import React from 'react';
import PropTypes from 'prop-types';

// Outside of component so they wont be recreated each render
const createKey = (movie, column) => {
  return movie.id + (column.path || column.key);
};

const renderCell = (movie, column) => {
  return column.content ? column.content(movie) : movie[column.path];
};

const mapMoviesToTable = (movies, columns) => {
  return movies.map(movie => (
    <tr key={movie.id}>
      {columns.map(column => (
        <td key={createKey(movie, column)}>{renderCell(movie, column)}</td>
      ))}
    </tr>
  ));
};

const TableBody = props => {
  const { columns, movies } = props;
  const movieRows = mapMoviesToTable(movies, columns);
  return <tbody>{movieRows}</tbody>;
};

TableBody.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  movies: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default TableBody;
