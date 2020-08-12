import React, { Component } from 'react';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.renderSeriesFound = this.renderSeriesFound.bind(this);
  }

  renderSeriesFound() {
    let series_found = <h1>There are no series found</h1>;
    if (this.props.seriesFound) {
      series_found = this.props.seriesFound.map(series => (
        <div>
          <p>
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
        <input
          value={this.props.inputValue}
          onChange={e => this.props.onChangeHandler(e)}
          placeholder="Type something to search"
        />
        {this.renderSeriesFound()}
      </div>
    );
  }
}

export default SearchBar;