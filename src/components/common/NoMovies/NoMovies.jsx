import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {Button, Row} from 'reactstrap';

const NoMovies = () => (
  <>
    <Row className="d-flex justify-content-center">
      <h3 data-testid="no-movies">Add a movie now!</h3>
    </Row>
    <Row className="d-flex justify-content-center pt-3">
      <LinkContainer to="/movies/new">
        <Button size="lg">New Movie</Button>
      </LinkContainer>
    </Row>
  </>
);

export default NoMovies;
