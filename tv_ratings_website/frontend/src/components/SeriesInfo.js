import React, { Component } from "react";
import { LineChart, Line } from 'recharts';

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
        <p>{episode.name}</p>
        <p>{episode.average_rating}</p>
        <p>{episode.num_votes}</p>
      </div>
    ));
  }
  render () {
    return (
      <div className="series-info">
        <h1>{this.props.info.primary_title}</h1>
        <div>
          <LineChart width={800} height={400} data={this.props.info.episodes}>
            <Line type="monotone" dataKey="average_rating" stroke="#8884d8" />
          </LineChart>
        </div>
        <div>
          {this.renderEpisodes()}
        </div>
      </div>
    );
  }
}

export default SeriesInfo;
