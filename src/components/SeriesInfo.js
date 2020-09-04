import React, { Component } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Label, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import ColoredCursor from "./ColoredCursor";
import CustomTooltip from "./CustomTooltip";
import tvTestCard from "../media/tvtestcard.png";

class SeriesInfo extends Component {
  constructor(props) {
    super(props);
    this.renderEpisodes = this.renderEpisodes.bind(this);
    this.filterEpisodes = this.filterEpisodes.bind(this);
    this.xTicks = this.xTicks.bind(this);
    this.chartIsActive = this.chartIsActive.bind(this);
    this.chartIsNotActive = this.chartIsNotActive.bind(this);
    this.state = {
      chartIsActive: false,
    }
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
        <div className="bottom-table-cell inline">
          <div className="percent-bar popular-dark-green ">
            <div 
              className="inner-percent-bar popular-green" 
              style={{"width": `${episode.average_rating * 50}px`}}
            >
              <p className="text-style episode-percent-text inline">
                S{episode.season_number} E{episode.episode_number}, "{episode.name}" 
              </p>
              <p className="inline in-percent-text text-style">{episode.average_rating}</p>
            </div>
          </div>
        </div>
        <div className="bottom-table-cell inline right">
          <div className="percent-bar unpopular-dark-red">
            <div 
              className="inner-percent-bar unpopular-red" 
              style={{"width": `${unPopEpisodeList[i].average_rating * 50}px`, "display": "inline-block"}}
            >
              <p className="text-style episode-percent-text">
                S{unPopEpisodeList[i].season_number} E{unPopEpisodeList[i].episode_number}, "{unPopEpisodeList[i].name}"
              </p>
            </div>
            <p className="inline text-style out-percent-text">{unPopEpisodeList[i].average_rating}</p>
          </div>
          
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
  chartIsActive() {
    if (!this.state.chartIsActive){
      this.setState({chartIsActive: true, titleClass: ""})
    }
  }
  chartIsNotActive() {
    if (this.state.chartIsActive){
      this.setState({chartIsActive: false, titleClass: "large-title"})
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
        <div className="back-to-search-container">
          <a className="back-to-search" href="/">
            <div className="fa fa-search"></div> Back To Search
          </a>
          <img className="test-card-back" src={tvTestCard}/>
        </div>
        <div className="title-container">
          <h3 id="series-title" className="text-style series-title large-title">
            {this.props.info.primary_title + ' '} 
            ({this.props.info.start_year + ' '}
            - 
            {' ' + (this.props.info.end_year !== -1 ? this.props.info.end_year : 'present')})
          </h3>
          <p id="episode-title-container" className="text-style episode-title-container"></p>
        </div>
        <div className="top-content-container">
          <div className="episode-top-container">
            <div className="chart-container">
              <ResponsiveContainer height={420} width='100%'>
                <LineChart 
                  margin={{bottom: 25, right: 25, left: -15}} 
                  data={filteredEpisodes}
                  onMouseLeave={this.chartIsNotActive}
                  onMouseMove={this.chartIsActive}
                >
                  <Line 
                    type="linear" 
                    dataKey="average_rating" 
                    stroke="white" 
                    strokeWidth={1.5}
                    dot={true}
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
                  {(filteredEpisodes.length > 0 && false) &&
                    <ReferenceLine x={filteredEpisodes[0].name} stroke="green">
                      <Label
                        value={filteredEpisodes[0].num_votes} 
                        position={{ y: -50 }}
                        offset={400}
                        style={{
                          fill: 'white',
                          fontFamily: 'Arial'
                        }}
                      />
                    </ReferenceLine>
                  }
                  <ColoredCursor 
                    position={{ y: -50 }} 
                    cursor={{ strokeWidth: '1.75'}} 
                    isAnimationActive={false}
                    content={
                      <CustomTooltip 
                        info={this.props.info} 
                        filteredEps={filteredEpisodes}
                        hidden={!this.state.chartIsActive}
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
              <div className="bottom-table-cell inline">
                <h3 className="text-style">Popular Episodes</h3>
              </div>
              <div className="bottom-table-cell inline right">
                <h3 className="text-style">Unpopular Episodes</h3>
              </div>
            </div>
            {this.renderEpisodes()}
            
          </div>
        </div>
      </div>
    );
  }
}

export default SeriesInfo;

