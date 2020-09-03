import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SeriesInfoContainer from './containers/SeriesInfoContainer';
import SearchBarContainer from './containers/SearchBarContainer';
import './App.css';

function App() {
  return (
    <main className="App">
      <Router>
        <Route exact path="/" component={SearchBarContainer} />
        <Route path="/series/:seriesId" component={SeriesInfoContainer} />
      </Router>
    </main>
  );
}

export default App;
