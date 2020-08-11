import React from 'react';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import SeriesInfo from './components/SeriesInfo';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  return (
    <main className="App">
      <Router>
        <Route path="/search/" component={SearchBar} />
        <Route path="/series/:seriesId" component={SeriesInfo} />
      </Router>
    </main>
  );
}

export default App;
