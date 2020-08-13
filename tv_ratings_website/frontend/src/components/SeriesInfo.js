import React, { Component } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label } from 'recharts';

const CustomTooltip = ({ active, payload, label, info, filteredEps }) => {
  let episode = {};
  for (let i = 0; i < info.episodes.length; i++) {
    // TODO: find episode by id, not name
    if (info.episodes[i].name === label) {
      episode = info.episodes[i]; 
      break;
    } else if (filteredEps[i].name === label) {
      episode = info.episodes[i];
      break;
    }
  }
  if (active && payload != null) {
    return (
      <div className="custom-tooltip">
        <p>{`Season ${episode.season_number} Episode ${episode.episode_number}`}</p>
        <p>{`"${episode.name}"`}</p>
        <p>{`rating : ${episode.average_rating}`}</p>
        <p>{`votes : ${episode.num_votes}`}</p>
      </div>
    );
  }

  return null;
};

class SeriesInfo extends Component {
  constructor(props) {
    super(props);
    this.renderPopularEpisodes = this.renderPopularEpisodes.bind(this);
    this.renderUnpopularEpisodes = this.renderUnpopularEpisodes.bind(this);
    this.filterEpisodes = this.filterEpisodes.bind(this);
    this.xTicks = this.xTicks.bind(this);
  }
  xTicks(eps) {
    let ticks = [];
    for (let i = 0; i < eps.length; i++) {
      let ep = eps[i];
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
  renderUnratedEpisodes () {
    if (!this.props.unratedEpisodes){
      return;
    }
    if (this.props.unratedEpisodes.length > 0){
      return (
        this.props.unratedEpisodes.map(episode => (
          <div key={episode.id}>
            <p>{episode.name}, Season {episode.season_number} Episode {episode.episode_number}</p>
          </div>
        ))
      );
    }
  }
  filterEpisodes(episodes) {
    let newEps = [];
    for (let i = 0; i < episodes.length; i++) {
      let ep = {...episodes[i]};
      if (ep.episode_number === 1){
        ep.name = JSON.stringify(ep.season_number);
      } 
      newEps.push(ep);
    }
    return newEps;
  }
  render () {
    let filteredEpisodes = this.filterEpisodes(this.props.info.episodes);
    return (
      <div className="series-info">
        <a href="/search">Back To Search</a>
        <h1>
          {this.props.info.primary_title + ' '} 
          ({this.props.info.start_year + ' '}
          - 
          {' ' + (this.props.info.end_year !== -1 ? this.props.info.end_year : 'present')})
        </h1>
        <div >
          <LineChart margin={{bottom: 25}} width={800} height={420} data={filteredEpisodes}>
            <Line type="monotone" dataKey="average_rating" stroke="black" dot={false}/>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis 
              dataKey="name" 
              interval={0}
              ticks={this.xTicks(filteredEpisodes)}
              padding={{left:20, right:20}}
            >
              <Label value="Seasons" position="bottom" offset={5} />
            </XAxis>
            <YAxis domain={[0,10]} ticks={[0,2,4,6,8,10]}/>
            <Tooltip content={<CustomTooltip info={this.props.info} filteredEps={filteredEpisodes}/>}/>
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
            <div className="episode-list">
              <h3>Unrated Episodes</h3>
              {this.renderUnratedEpisodes()}
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}

export default SeriesInfo;
