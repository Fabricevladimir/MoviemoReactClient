import {Link} from 'react-router-dom';
import React, { PureComponent } from 'react';
import {ListGroup, ListGroupItem, Col, Row} from 'reactstrap';

import Error from '../../common/Error/Error';
import Logger from '../../../services/loggerService';
import Spinner from '../../common/Spinner/Spinner';
import NoMovies from '../../common/NoMovies/NoMovies';
import SearchBox from '../../common/SearchBox/SearchBox';
import MovieTable from '../MovieTable/MovieTable';
import Pagination from '../../common/Pagination/Pagination';
import { getGenres } from '../../../services/fakeGenreService';
//import { getGenres } from '../../../services/genreService';
import paginateItems from '../../../utils/paginate';
import NotificationService from '../../../services/notificationService';
import { getMovies, deleteMovie } from '../../../services/fakeMovieService';
//import { getMovies, deleteMovie } from '../../../services/movieService';

const PAGE_SIZE = 4;
const ALL_GENRES = { id: 0, name: 'All Genres' };

class Movies extends PureComponent {
  state = { 
    error: null, 
    movies: [], 
    genres: [ALL_GENRES], 
    isLoading: false, 
    currentPage: 1, 
    searchQuery: '', 
    selectedGenre: ALL_GENRES};

  async componentDidMount() {
    this.mounted = true;
    const {genres} = this.state;
    this.setState({...this.state, isLoading: true});
    try {
      const {data: movies} = await getMovies();
      const {data: genresData} = await getGenres();

      const allGenres = genres.concat(genresData);

      // Anti-Pattern: for bigger app, should probably
	    // use useEffect hook with return cancelling
	    // the fetch request so state does not get updated
	    // after the component is unmounted
      if(this.mounted) {
        this.setState({...this.state, movies, 
          genres: allGenres, 
          isLoading : false}
          );
        }
    } catch (error) {
      Logger.log(error); 

      if(this.mounted) {
        this.setState({...this.state, error, isLoading: false});
      }
    }
  }

  render() { 
    const {error, movies, isLoading} = this.state;
    if (error) return <Error />;
    if (isLoading) return <Spinner />;
    return movies.length !== 0 ? this.renderMovies() : <NoMovies />;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  genreSelectHandler = selectedGenre => {
    this.setState({...this.state, 
      selectedGenre, 
      searchQuery:'', 
      currentPage: 1});
  };

  searchQueryChangeHandler = searchQuery => {
    this.setState({...this.state,
      selectedGenre: ALL_GENRES,
      searchQuery});
  };

  pageChangeHandler = currentPage => {
    this.setState({...this.state, currentPage});
  };

  movieDeleteHandler = async movie => {
    const {movies} = this.state;
    try {
      await deleteMovie(movie.id);
      const newMovies = movies.filter(m => m.id !== movie.id);
      this.setState({...this.state, movies: newMovies});
      NotificationService.success(`Removed ${movie.title} from the database`);
    } catch (err) {
      NotificationService.error('Error! Unable to delete movie.');
    }
  };

  filterMovies = (selectedGenre, searchQuery, movies) => {
    return selectedGenre === ALL_GENRES
      ? movies.filter(m =>
          m.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
        )
      : movies.filter(m => m.genre === selectedGenre.name);
  };

  renderMovies = () =>  {
    const {
      movies, 
      genres,
      searchQuery, 
      currentPage, 
      selectedGenre} = this.state;

    const filtered = this.filterMovies(selectedGenre, searchQuery, movies);
    const paginated = paginateItems(filtered, currentPage, PAGE_SIZE);

    return ( 
      <Row data-testid="movies">
        <Col xs="3">
        <ListGroup data-testid="list-group">{genres.map(g => (
            <ListGroupItem
              tag="button"
              key={g.id}
              active={g === selectedGenre}
              onClick={() => this.genreSelectHandler(g)}
            >{g.name}</ListGroupItem>))}
        </ListGroup>
        </Col>
        <Col xs="8">
          <Link to="/movies/new" className="btn btn-primary">Add Movie</Link>
          <p className="mt-3">There are {movies.length} movie(s) in the database.</p>
          <SearchBox value={searchQuery} onChange={this.searchQueryChangeHandler} />
          <MovieTable
            movies={paginated}
            onMovieDelete={this.movieDeleteHandler}
          />
          <Pagination
            pageSize={PAGE_SIZE}
            itemCount={filtered.length}
            currentPage={currentPage}
            onPageChange={this.pageChangeHandler}
          />
        </Col>
      </Row>
    );
  }
}
 
export default Movies;


