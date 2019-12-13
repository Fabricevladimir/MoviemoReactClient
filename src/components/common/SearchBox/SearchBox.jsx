import React from 'react';
import PropTypes from 'prop-types';

const SearchBox = props => {
  const { value, onChange, placeholder } = props;
  return (
    <input
      id="search"
      type="search"
      name="search"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="form-control my-3"
    />
  );
};

SearchBox.defaultProps = {
  placeholder: 'Search...'
};

SearchBox.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default SearchBox;
