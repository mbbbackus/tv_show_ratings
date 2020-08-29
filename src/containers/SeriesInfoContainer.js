import React, { Component } from "react";
import axios from "axios";
import SeriesInfo from '../components/SeriesInfo';

class SeriesInfoContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        episodes: [],
        unrated: []
      }
    };
    this.cleanSeriesInfo = this.cleanSeriesInfo.bind(this);
    this.compareRating = this.compareRating.bind(this);
  }
  compareRating (a, b) {
    if (a.average_rating > b.average_rating) return 1;
    if (a.average_rating < b.average_rating) return -1;
    return 0;
  }
  cleanSeriesInfo(info) {
    let sortedInfo = info;
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
    sortedInfo.episodes.sort(compare);

    let ratedInfo = {...sortedInfo}
    ratedInfo.episodes = [];
    let unrated = [];
    for (let i = 0; i < sortedInfo.episodes.length; i++) {
      if (sortedInfo.episodes[i].average_rating === -1) {
        unrated.push(sortedInfo.episodes[i]);
      } else {
        ratedInfo.episodes.push(sortedInfo.episodes[i]);
      }
    }

    return {
      info: ratedInfo,
      unrated: unrated
    };
  }
  loadSeries = () => {
    const series_uuid = this.props.match.params.seriesId;
    axios.get("/api/series/" + series_uuid)
      .then(res => this.setState(this.cleanSeriesInfo(res.data)))
      .catch(err => console.log(err));
  }
  componentDidMount() {
    this.loadSeries();
  }
  render () {
    document.title = "Plot the plot";
    if (this.state.info.primary_title)
      document.title = "Plot the plot | " + this.state.info.primary_title;
    return (
      <SeriesInfo
        info={this.state.info}
        unratedEpisodes={this.state.unrated}
        compareRating={this.compareRating}
      />
    );
  }
}

export default SeriesInfoContainer;
