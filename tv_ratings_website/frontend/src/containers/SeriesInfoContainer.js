import React, { Component } from "react";
import axios from "axios";
import SeriesInfo from '../components/SeriesInfo';

class SeriesInfoContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        episodes: []
      }
    };
    this.cleanSeriesInfo = this.cleanSeriesInfo.bind(this);
  }
  cleanSeriesInfo(info) {
    let sortedInfo = info;
    console.log(sortedInfo);
    sortedInfo.episodes = info.episodes.map(episode => (
      {
        episode_number: episode.episode_number,
        season_number: episode.season_number,
        average_rating: (episode.ratings.length > 0 ? episode.ratings[0].average_rating : -1),
        num_votes: (episode.ratings.length > 0 ? episode.ratings[0].num_votes : -1),
        name: (episode.names.length > 0 ? episode.names[0].primary_name : -1),
        id: episode.id,
      }
    ));
    function compare(a, b) {
      let aSeason = a.season_number;
      let bSeason = b.season_number;
      if (aSeason > bSeason) return 1;
      if (aSeason < bSeason) return -1;
      let aEpiNum = a.episode_number;
      let bEpiNum = b.episode_number;
      if (aEpiNum > bEpiNum) return 1;
      if (aEpiNum < bEpiNum) return -1;
      return 0;
    }
    // let sortedEpisodes = [...info.episodes];
    sortedInfo.episodes.sort(compare);
    // sortedInfo.episodes = sortedEpisodes;

    return sortedInfo;
  }
  loadSeries = () => {
    const series_uuid = this.props.match.params.seriesId;
    axios.get("http://localhost:8000/api/series/" + series_uuid)
      .then(res => this.setState({ info: this.cleanSeriesInfo(res.data) }))
      .catch(err => console.log(err));
  }
  componentDidMount() {
    this.loadSeries();
  }
  render () {
    return (
      <SeriesInfo
        info={this.state.info}
      />
    );
  }
}

export default SeriesInfoContainer;
