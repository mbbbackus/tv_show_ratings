import React, { Component } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';

class SearchBarContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      series_found: null,
      loading: false,
      offset: 0,
      value: ''
    };
    this.getMoreResults = this.getMoreResults.bind(this);
  }
  
  search = val => {
    if (val === "") {
      this.setState({series_found: ""});
      return;
    }
    this.setState({ loading: true, offset: 0 });
    axios.get(
     	`/api/series_by_original_title/?search=${val}`
    ).then(res => this.setState(
    	{
    		series_found: res.data.results, 
    		loading: false 
    	}
    )).catch(err => console.log(err));
  };
  onChangeHandler = async e => {
    this.search(e.target.value);
    this.setState({ value: e.target.value });
  };
  getMoreResults () {
    axios.get(
      `/api/series_by_original_title/?offset=${this.state.offset + 10}&search=${this.state.value}`
    ).then(res => this.setState(
      {
        series_found: this.state.series_found.concat(res.data.results), 
        loading: false 
      }
    )).catch(err => console.log(err));
    let offset = this.state.offset;
    this.setState({ offset: offset + 10 });
  }

  render() {
    return (
      <SearchBar
        onChangeHandler={this.onChangeHandler}
        inputValue={this.state.value}
        seriesFound={this.state.series_found}
        getMoreResults={this.getMoreResults}
        offset={this.state.offset}/*remainder as in, how many series were pulled on top of the current offset*/
      />
    );
  }
}

export default SearchBarContainer;