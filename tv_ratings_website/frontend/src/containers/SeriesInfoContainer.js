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
    let sortedInfo = [];
    let seasons = [];

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
