import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';

import Layout from './components/common/Layout/Layout';
import Movies from './components/containers/Movies/Movies';
import NotFound from './components/common/NotFound/NotFound';
import MovieForm from './components/containers/MovieForm/MovieForm';
import LogService from './services/loggerService';
import NotificationService from './services/notificationService';

LogService.init();
NotificationService.init();

const App = () => {
  return (
    <Layout>
      <Switch>
        <Route path="/movies/:id" component={MovieForm} />
        <Route path="/movies" component={Movies} />
        <Route path="/not-found" component={NotFound} />
        <Redirect from="/" exact to="/movies" />
        <Redirect to="not-found" />
      </Switch>
    </Layout>
  );
}
 
export default App;