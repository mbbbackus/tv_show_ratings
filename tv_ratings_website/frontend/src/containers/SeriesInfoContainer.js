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
    this.sortSeriesInfo = this.sortSeriesInfo.bind(this);
  }
  sortSeriesInfo(info) {
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
    let sortedEpisodes = [...info.episodes];
    sortedEpisodes.sort(compare);
    let sortedInfo = info;
    sortedInfo.episodes = sortedEpisodes;

    return sortedInfo;
  }
  loadSeries = () => {
    const series_uuid = this.props.match.params.seriesId;
    axios.get("http://localhost:8000/api/series/" + series_uuid)
      .then(res => this.setState({ info: this.sortSeriesInfo(res.data) }))
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
