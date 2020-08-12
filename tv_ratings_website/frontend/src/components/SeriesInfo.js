import React, { Component } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

class SeriesInfo extends Component {
  constructor(props) {
    super(props);
    this.renderPopularEpisodes = this.renderPopularEpisodes.bind(this);
    this.renderUnpopularEpisodes = this.renderUnpopularEpisodes.bind(this);
    this.xTicks = this.xTicks.bind(this);
  }
  xTicks() {
    let ticks = [];
    for (let i = 0; i < this.props.info.episodes.length; i++) {
      let ep = this.props.info.episodes[i];
      if (ep.episode_number === 1){
        ticks.push(ep.name);
      } 
    }

    return ticks;
  }
  renderPopularEpisodes () {
    if (this.props.info.episodes.length === 0)
      return;
    let popEpisodeList = [...this.props.info.episodes];
    popEpisodeList.sort(this.props.compareRating);
    popEpisodeList = popEpisodeList.splice(popEpisodeList.length-5,popEpisodeList.length-1).reverse();
    return popEpisodeList.map(episode => (
      <div key={episode.id}>
        <p>{episode.name}, {episode.average_rating}</p>
      </div>
    ));
  }
  renderUnpopularEpisodes () {
    if (this.props.info.episodes.length === 0)
      return;
    let unPopEpisodeList = [...this.props.info.episodes];
    unPopEpisodeList.sort(this.props.compareRating);
    unPopEpisodeList = unPopEpisodeList.splice(0,5);
    return unPopEpisodeList.map(episode => (
      <div key={episode.id}>
        <p>{episode.name}, {episode.average_rating}</p>
      </div>
    ));
  }
  render () {
    return (
      <div className="series-info">
        <h1>{this.props.info.primary_title} ({this.props.info.start_year} - {this.props.info.end_year !== -1 ? this.props.info.end_year : '?'})</h1>
        <div>
          <LineChart width={800} height={400} data={this.props.info.episodes}>
            <Line type="monotone" dataKey="average_rating" stroke="#8884d8" dot={false}/>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" ticks={this.xTicks()} padding={{left:30, right:30}} hide={true}/>
            <YAxis domain={[0,10]} ticks={[0,2,4,6,8,10]}/>
            <Tooltip/>
          </LineChart>
        </div>
        <div className="random-container"> 
          <div className="episode-lists-container">
            <div className="episode-list">
              <h3>Popular Episodes</h3>
              {this.renderPopularEpisodes()}
            </div>
            <div className="episode-list">
              <h3>Unpopular Episodes</h3>
              {this.renderUnpopularEpisodes()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SeriesInfo;
