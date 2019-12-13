import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {Pagination as Pages, PaginationItem, PaginationLink} from 'reactstrap';

const mapPagesToList = (pages, currentPage, onPageChange) => {
  return pages.map(page => (
    <PaginationItem
      key={page}
      active={page === currentPage}
    >
      <PaginationLink
        onClick={() => onPageChange(page)}
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  ));
};

const Pagination = props => {
  const { currentPage, itemCount, pageSize, onPageChange } = props;
  const pageCount = Math.ceil(itemCount / pageSize);

  // No need to have pagination if it all fits on one page
  if (pageCount === 1) return null;

  const pages = _.range(1, pageCount + 1);
  const pageList = mapPagesToList(pages, currentPage, onPageChange);
  return<Pages>{pageList}</Pages>;
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default Pagination;
