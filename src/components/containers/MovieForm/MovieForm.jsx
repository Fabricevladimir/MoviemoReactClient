import { object, string, number } from 'yup';
import React, { PureComponent} from 'react';

import Error from '../../common/Error/Error';
import Spinner from '../../common/Spinner/Spinner';
//import { getGenres } from '../../../services/genreService';
import { getGenres } from '../../../services/fakeGenreService';
import LoggerService from '../../../services/loggerService';
import NotificationService from '../../../services/notificationService';
//import { getMovie, editMovie, postMovie } from '../../../services/movieService';
import {
  getMovie,
  editMovie,
 postMovie
} from '../../../services/fakeMovieService';
import { Card, CardTitle, Row, Col, Form, FormGroup, Input, Label, Button } from 'reactstrap';
import FormText from 'reactstrap/lib/FormText';

const toastId = 1;
const NEW_MOVIE = 'new';

const genreSchema = number().required();
const movieSchema = string()
  .min(3)
  .required();

class MovieForm extends PureComponent {
  state = {
    title: '',
    error: null,
    genres: [],
    genreId: 0,
    movieId: null,
    isLoading: false,
    formErrors: {}
   }

  async componentDidMount() {
    const {match: {params: {id}}} = this.props;
    this.mounted = true;
    this.setState({...this.state, isLoading: true, movieId: id});

    try {
      const {data: genres} = await getGenres();
      await this.mapToViewModel(id, genres);
    } catch (error) {
      this.setState({...this.state, error, isLoading:false});
    }
  }

  render() {
    const {isLoading, error} = this.state;

    if (error) return <Error />;
    if (isLoading) return <Spinner />;
    
    return this.renderForm();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleFormChange = (event) => {
    const { name, value } = event.target;
    name === 'title' ?
      this.validateProperty(movieSchema, name, value) :
      this.validateProperty(genreSchema, name, value);
  };

  handleSubmitAsync = async event => {
    event.preventDefault();
    const isValid = await this.validateFormAsync();
    if (isValid) {
    await this.saveMovieAsync();
     }
  };

  async validateProperty(schema, name, value)  {
    const {formErrors} = this.state;
    try {
      await schema.validate(value);
      formErrors[name] = false;
    } catch (err) {
      formErrors[name] = true;
    } finally {
      this.setState({...this.state, formErrors, [name]: value});
    }
  };

  async validateFormAsync () {
    const {title, genreId, formErrors} = this.state;
    const schema = object().shape({ title: movieSchema, genreId: genreSchema });
    let isValid = false;
    try {
      await schema.validate({ title, genreId });
      isValid = true;
    } catch (err) {
      const errors = {...formErrors, [err.path]: err.message};
      this.setState({...this.state, formErrors: errors });
    }
    return isValid;
  };

  async saveMovieAsync() {
    this.setState({...this.state, isLoading: true});
    const {movieId, genreId, title} = this.state;
    const {history} = this.props;

    try {
      if(movieId === NEW_MOVIE)
        await postMovie({ title, genreId });
      else
        await editMovie(movieId, { title, genreId });
      
      if(this.mounted) {
        this.setState({...this.state, isLoading: false});
        history.push('/movies');
      }
    } catch (ex) {
      LoggerService.log(ex);
      if(this.mounted) {
        this.setState({...this.state, isLoading: false});
        NotificationService.error(
          'Unable to save movie. Please try again later.',{ toastId });
      }
    }
  };

  mapToViewModel = async (id, genres) => {
    if(id !== NEW_MOVIE) {
      const {data: movie} = await getMovie(id);
      if(this.mounted) {
        this.setState({...this.state,
          genres,
          title: movie.title,
          genreId: movie.genreId,
          movieId: id,
          isLoading: false
        });
      }
    } else {
      if(this.mounted) {
        this.setState({...this.state, 
          genres, 
          movieId: id,
          isLoading: false
        });
      }
    }
  }

  renderForm() { 
    const {title, formErrors, isLoading, genres, genreId} = this.state;
    return (
      <Row>
        <Col sm="4"/>
        <Col sm="4">
          <Card body>
          <CardTitle>About the movie</CardTitle>
            <Form  onSubmit={this.handleSubmitAsync}>
              <FormGroup>   
                <Label for="title">Movie Title</Label>
                <Input 
                  id="title" 
                  type="text" 
                  name="title"
                  value={title}
                  pattern=".{3,}"
                  valid={formErrors.title === false}
                  invalid={formErrors.title === true}
                  title="3 characters minimum"
                  onChange={this.handleFormChange} 
                  disabled={isLoading}
                  placeholder="Enter movie title"
                  required/>
                <FormText>
                  Must contain at least 3 characters
                </FormText>
              </FormGroup>
              <FormGroup>
                <Label for="genreId">Movie Genre</Label>
                <Input
                  id="genreId"
                  type="select"
                  name="genreId"
                  value={genreId}
                  invalid={formErrors.genreId === true}
                  onChange={this.handleFormChange}
                  disabled={isLoading}
                  required
                >
                  <option value="">Select a genre...</option>
                  {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </Input>
              </FormGroup>
              <FormGroup>
                <Button
                  block
                  color="primary"
                  //disabled={isLoading || Object.keys(formErrors).length > 0}
                >Submit
                </Button>
              </FormGroup>
            </Form>
          </Card>
        </Col>
      </Row>
    );
  }
}
 
export default MovieForm;
