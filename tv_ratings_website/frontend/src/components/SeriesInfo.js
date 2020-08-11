import React, { Component } from "react";
import axios from "axios";

class SeriesInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        episodes: []
      }
    };
    this.renderEpisodes = this.renderEpisodes.bind(this);
  }
  loadSeries = () => {
    const series_uuid = this.props.match.params.seriesId;
    axios.get("http://localhost:8000/api/series/" + series_uuid)
      .then(res => this.setState({ info: res.data }))
      .catch(err => console.log(err));
  }
  renderEpisodes () {
    if (this.state.info.episodes.length == 0)
      return;
    return this.state.info.episodes.map(episode => (
      <div>
        <p>{episode.names[0].primary_name}</p>
        <p>{episode.ratings.length == 0 ? "no rating" : episode.ratings[0].average_rating}</p>
        <p>{episode.ratings.length == 0 ? "no votes" : episode.ratings[0].num_votes}</p>
      </div>
    ));
  }
  componentDidMount() {
    this.loadSeries();
  }
  render () {
    return (
      <div className="series-info">
        <h1>{this.state.info.primary_title}</h1>
        <div>
          {this.renderEpisodes()}
        </div>
      </div>
    );
  }
}

export default SeriesInfo;
