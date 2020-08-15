import React, { Component } from 'react';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.renderSeriesFound = this.renderSeriesFound.bind(this);
  }

  renderSeriesFound() {
    let series_found = "";
    if (this.props.seriesFound) {
      series_found = this.props.seriesFound.map(series => (
        <div className="series-container">
          <p className="series-found">
            <a href={"/series/"+series.id}>
              {series.original_title} ({series.start_year})
            </a>
          </p>
        </div>
      ));
    }

    return series_found;
  }

  render() {
    return (
      <div>
        <div className="search-bar-container">
          <div className="search-bar">
            <input
              className="search-bar-input"
              value={this.props.inputValue}
              onChange={e => this.props.onChangeHandler(e)}
              placeholder="Enter a tv show"
            />
          </div>
        </div>
        <div className="series-found-container">
          {this.props.seriesFound && this.renderSeriesFound()}
          {this.props.seriesFound &&
            <button 
              onClick={this.props.getMoreResults}
            >
              Get More Results
            </button>
          }
        </div>
        
      </div>
    );
  }
}

export default SearchBar;