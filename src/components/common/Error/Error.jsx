import React from 'react';
import {Row} from 'reactstrap';

const ErrorPage = () => {
  return (
    <Row className="d-flex justify-content-center">
      <h3 data-testid="error-page">
        Error! Something went wrong. Please try again later.
      </h3>
    </Row>
  );
};

export default ErrorPage;
