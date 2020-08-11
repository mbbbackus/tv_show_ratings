import React, { Component } from "react";

class SeriesInfo extends Component {
  constructor(props) {
    super(props);
    this.renderEpisodes = this.renderEpisodes.bind(this);
  }

  renderEpisodes () {
    if (this.props.info.episodes.length === 0)
      return;
    return this.props.info.episodes.map(episode => (
      <div>
        <p>{episode.names[0].primary_name}</p>
        <p>{episode.ratings.length === 0 ? "no rating" : episode.ratings[0].average_rating}</p>
        <p>{episode.ratings.length === 0 ? "no votes" : episode.ratings[0].num_votes}</p>
      </div>
    ));
  }
  render () {
    return (
      <div className="series-info">
        <h1>{this.props.info.primary_title}</h1>
        <div>
          {this.renderEpisodes()}
        </div>
      </div>
    );
  }
}

export default SeriesInfo;
