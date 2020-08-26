import React, { Component } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import ColoredCursor from "./ColoredCursor";
import CustomTooltip from "./CustomTooltip";
import tvTestCard from "../media/tvtestcard.png";

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
        <a className="back-to-search" href="/search">Back To Search</a>
        <img className="test-card-back" src={tvTestCard}/>
        <h3 className="text-style series-title">
          {this.props.info.primary_title + ' '} 
          ({this.props.info.start_year + ' '}
          - 
          {' ' + (this.props.info.end_year !== -1 ? this.props.info.end_year : 'present')})
        </h3>
        <p id="episode-title" className="text-style"></p>
        <div className="top-content-container">
          <div className="episode-top-container">
            <div className="chart-container">
              <ResponsiveContainer height={420} width='100%'>
                <LineChart 
                  margin={{bottom: 25, right: 25, left: -15}} 
                  data={filteredEpisodes}
                >
                  <Line 
                    type="step" 
                    dataKey="average_rating" 
                    stroke="white" 
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={false}
                    connectNulls={false}
                  />
                  <CartesianGrid stroke="white" strokeDasharray="0 5" />
                  <XAxis 
                    dataKey="name" 
                    interval={0}
                    ticks={this.xTicks(filteredEpisodes)}
                    padding={{left:20, right:20}}
                    stroke="white"
                  >
                    <Label
                      value={'season number'}
                      position={'bottom'}
                      style={{
                        fill: 'white',
                        fontFamily: 'Arial'
                      }}
                    />
                  </XAxis>
                  <YAxis 
                    domain={ydomain} 
                    stroke="white"
                  >
                    <Label
                      value={'episode rating'} 
                      angle={-90} 
                      position={'insideLeft'} 
                      offset={20}
                      style={{
                        fill: 'white',
                        fontFamily: 'Arial'
                      }}
                    />
                  </YAxis>
                  <ColoredCursor 
                    position={{ y: -50 }} 
                    cursor={{ strokeWidth: '1.75'}} 
                    isAnimationActive={false}
                    content={
                      <CustomTooltip 
                        info={this.props.info} 
                        filteredEps={filteredEpisodes}
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

