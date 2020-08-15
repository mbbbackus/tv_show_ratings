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
            <a className="text-style" href={"/series/"+series.id}>
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
          <h1 className="plot-title text-style">Plot the Plot</h1>
          <h2 className="plot-subtitle text-style">Explore the data behind your favorite tv shows</h2>
          <div className="search-bar">
            <input
              className="search-bar-input"
              value={this.props.inputValue}
              onChange={e => this.props.onChangeHandler(e)}
              placeholder="e.g. Game of Thrones"
            />
          </div>
        </div>
        <div className="series-found-container">
          {this.props.seriesFound && this.renderSeriesFound()}
          {this.props.seriesFound &&
            <div className="get-more-results">
              <button
                onClick={this.props.getMoreResults}
              >
                Get More Results
              </button>
            </div>
          }
        </div>
        
      </div>
    );
  }
}

export default SearchBar;