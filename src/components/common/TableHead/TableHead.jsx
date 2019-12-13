import React from 'react';
import PropTypes from 'prop-types';

const mapColumnsToRow = columns => {
  return columns.map(column => (
    <th style={{width: "35%"}} scope="row" key={column.label || column.key}>
      {column.label}
    </th>
  ));
};

const TableHead = props => {
  const { columns } = props;
  const columnRow = mapColumnsToRow(columns);
  return (
    <thead>
      <tr>{columnRow}</tr>
    </thead>
  );
};

TableHead.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default TableHead;
