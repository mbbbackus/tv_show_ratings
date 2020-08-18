import React, { Component } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label, ResponsiveContainer } from 'recharts';

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
        <p className="tooltip-text">
          {`Season ${episode.season_number} Episode ${episode.episode_number}`}
        </p>
        <p className="tooltip-text">
          {`"${episode.name}"`}
        </p>
        <p className="tooltip-text">
          {`rating : ${episode.average_rating}`}
        </p>
        <p className="tooltip-text">
          {`votes : ${episode.num_votes}`}
        </p>
      </div>
    );
  }

  return null;
};

class SeriesInfo extends Component {
  constructor(props) {
    super(props);
    this.renderEpisodes = this.renderEpisodes.bind(this);
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
  renderEpisodes () {
    let len = this.props.info.episodes.length;
    if (len === 0)
      return;

    let episodeList = [...this.props.info.episodes];
    episodeList.sort(this.props.compareRating);
    let popEpisodeList = episodeList.splice(len-5, len-1).reverse();
    let unPopEpisodeList = episodeList.splice(0,5);
    let unratedEpisodes = this.props.unratedEpisodes

    return popEpisodeList.map((episode,i) => (
      <div className="bottom-table-row" key={episode.id}>
        <div className="bottom-table-cell">
          <p className="text-style">
            S{episode.season_number} E{episode.episode_number}, <b>"{episode.name}"</b>: {episode.average_rating}
          </p>
        </div>
        <div className="bottom-table-cell">
          <p className="text-style">
            S{unPopEpisodeList[i].season_number} E{unPopEpisodeList[i].episode_number}, <b>"{unPopEpisodeList[i].name}"</b>: {unPopEpisodeList[i].average_rating}
          </p>
        </div>
        <div className="bottom-table-cell"></div>
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
            <p className="text-style">
              S{episode.season_number} E{episode.episode_number}, <b>"{episode.name}"</b>
            </p>
          </div>
        ))
      );
    }
  }
  filterEpisodes(episodes) {
    let newEps = [];
    let ymin = 10;
    let ymax = 0;
    for (let i = 0; i < episodes.length; i++) {
      let ep = {...episodes[i]};
      if (ep.average_rating > ymax) {
        ymax = ep.average_rating;
      } else if (ep.average_rating < ymin) {
        ymin = ep.average_rating;
      }
      if (ep.episode_number === 1){
        ep.name = JSON.stringify(ep.season_number);
        // newEps.push({name: "season gap"}) de-comment to disconnect seasons on line graph
      } 
      newEps.push(ep);
    }

    return {
      ydomain: [Math.floor(ymin), Math.ceil(ymax)], 
      filteredEpisodes: newEps}
    ;
  }
  render () {
    let res = this.filterEpisodes(this.props.info.episodes);
    let ydomain = res.ydomain;
    let filteredEpisodes = res.filteredEpisodes;
    return (
      <div className="series-info">
        <a className="back-to-search text-style" href="/search">Back To Search</a>
        <h1 className="text-style series-title">
          {this.props.info.primary_title + ' '} 
          ({this.props.info.start_year + ' '}
          - 
          {' ' + (this.props.info.end_year !== -1 ? this.props.info.end_year : 'present')})
        </h1>
        <div className="top-content-container">
          <div className="episode-top-container">
            <div className="chart-container">
              <ResponsiveContainer height={420} width='100%'>
                <LineChart 
                  margin={{bottom: 25, right: 25, left:-20}} 
                  data={filteredEpisodes}
                >
                  <Line 
                    type="step" 
                    dataKey="average_rating" 
                    stroke="#614d12" 
                    strokeWidth={0.75}
                    dot={false}
                    connectNulls={false}
                  />
                  <CartesianGrid stroke="#614d12" strokeDasharray="0 5" />
                  <XAxis 
                    dataKey="name" 
                    interval={0}
                    ticks={this.xTicks(filteredEpisodes)}
                    padding={{left:20, right:20}}
                    stroke="#614d12"
                  />
                  <YAxis domain={ydomain} stroke="#614d12"/>
                  <Tooltip cursor={{ stroke: '#614d12'}} content={
                    <CustomTooltip 
                      info={this.props.info} 
                      filteredEps={filteredEpisodes}
                      stroke="#614d12"
                    />}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="bottom-table-container"> 
          <div className="bottom-table-body">
            <div className="bottom-table-row">
              <div className="bottom-table-cell">
                <h3 className="text-style">Popular Episodes</h3>
              </div>
              <div className="bottom-table-cell">
                <h3 className="text-style">Unpopular Episodes</h3>
              </div>
              {this.props.unratedEpisodes &&
                <div className="bottom-table-cell">
                  <h3 className="text-style">Unrated Episodes</h3>
                </div>
              }
            </div>
            {this.renderEpisodes()}
            
          </div>
        </div>
      </div>
    );
  }
}

export default SeriesInfo;

