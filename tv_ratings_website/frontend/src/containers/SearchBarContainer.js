import React, { Component } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';

class SearchBarContainer extends Component {
  state = {
    series_found: null,
    loading: false,
    value: ''
  };

  search = val => {
    this.setState({ loading: true });
    axios.get(
     	`http://localhost:8000/api/series_by_original_title/?search=${val}`
    ).then(res => this.setState(
    	{
    		series_found: res.data, 
    		loading: false 
    	}
    )).catch(err => console.log(err));
  };

  onChangeHandler = async e => {
    this.search(e.target.value);
    this.setState({ value: e.target.value });
  };

  get renderSeriesFound() {
    let series_found = <h1>There are no series found</h1>;
    if (this.state.series_found) {
      series_found = this.state.series_found.map(series => (
      	<div>
      		<p>
      			<a href={"/series/"+series.id}>
      				{series.original_title}
      			</a>
      		</p>
      	</div>
      ));
    }

    return series_found;
  }

  render() {
    return (
      <SearchBar
        onChangeHandler={this.onChangeHandler}
        inputValue={this.state.value}
        seriesFound={this.state.series_found}
      />
    );
  }
}

export default SearchBarContainer;