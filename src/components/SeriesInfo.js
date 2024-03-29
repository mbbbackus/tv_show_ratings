import React, { Component } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Label, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import ColoredCursor from "./ColoredCursor";
import CustomTooltip from "./CustomTooltip";
import tvTestCard from "../media/tvtestcard.png";

class SeriesInfo extends Component {
  constructor(props) {
    super(props);
    this.renderEpisodes = this.renderEpisodes.bind(this);
    this.renderCast = this.renderCast.bind(this);
    this.filterEpisodes = this.filterEpisodes.bind(this);
    this.xTicks = this.xTicks.bind(this);
    this.toggleBottom = this.toggleBottom.bind(this);
    this.chartIsActive = this.chartIsActive.bind(this);
    this.chartIsNotActive = this.chartIsNotActive.bind(this);
    this.mouseEnterAppearance = this.mouseEnterAppearance.bind(this);
    this.mouseLeaveAppearance = this.mouseLeaveAppearance.bind(this);
    this.state = {
      chartIsActive: false,
      toggleAppearances: true,
    }
  }
  toggleBottom() {
    this.setState({toggleAppearances: !this.state.toggleAppearances});
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
    let popEpisodeList = episodeList.reverse();
    let unPopEpisodeList = episodeList;
    let unratedEpisodes = this.props.unratedEpisodes;
    let percentBarWidth = (window.innerWidth - 400);
    return popEpisodeList.map((episode,i) => (
      <div className="bottom-table-row" key={episode.id}>
        <div className="bottom-table-cell inline">
          <div 
            className="percent-bar"
            style={{
                "width": `${percentBarWidth}px`,
                "background-color": `hsl(${(episode.average_rating * 10) - 30}, 100%, 5%)`,
            }}
          >
            <div 
              className="inner-percent-bar" 
              style={{
                  "width": `${(episode.average_rating / 10) * (percentBarWidth)}px`,
                  "background-color": `hsl(${(episode.average_rating * 10) - 30}, 100%, 20%)`
              }}
            >
              <span 
                title={episode.name} 
                className="text-style episode-percent-text inline"
              >
                S{episode.season_number} E{episode.episode_number}, "{episode.name}" 
              </span>
              <p className="inline in-percent-text text-style">{episode.average_rating}</p>
            </div>
          </div>
        </div>
        <div className="bottom-table-cell"></div> 
      </div>
    ));
  } //                ^^^ WTF THERE'S AN EXTRA CELL EVERY TIME??? WHEN DID I DO THAT??
  mouseEnterAppearance (person) {
  }
  mouseLeaveAppearance (person) {
  }
  renderCast () {
    let cast = this.props.cast;
    let castLength = cast[0][2].length;
    let classes = "bottom-table-cell inline bg-white ";
    return cast.map((person, i) => (
      <div className="bottom-table-row" key={i}>
        <div className="bottom-table-cell inline text-style name-cell">
          {person[3]}
        </div>
        <div className="inline app-row">
          {person[2].map((inEpisode, j) => {
            if (inEpisode) {
              return <div 
                        onMouseEnter={this.mouseEnterAppearance}
                        onMouseLeave={this.mouseLeaveAppearance}
                        className={inEpisode === 2 ? classes + "cell-separated": classes}
                        style={{"width": `${((window.innerWidth-395)/cast[0][2].length)}px`}}>
                    </div>;
            }
            else {
              return <div className="bottom-table-cell inline bg-black"
              style={{"width": `${((window.innerWidth-395)/cast[0][2].length)}px`}}></div>;
            }
          })}
        </div>
        
        <div className="bottom-table-cell inline text-style name-cell right-cell">
          {person[0]}
        </div>
        
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
        {this.props.info.primary_title === undefined ?
          <div className="loading-test-card">
            <img className="loading-img" src={tvTestCard}/>
          </div>
          :
          <div className="loaded-content-container">
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
                  <ResponsiveContainer height={360} width='100%'>
                    <LineChart 
                      margin={{bottom: 25, right: 25, left: 0}} 
                      data={filteredEpisodes}
                      onMouseLeave={this.chartIsNotActive}
                      onMouseMove={this.chartIsActive}
                    >
                      <Line 
                        type="linear" 
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
                        style={{
                          fill: 'white',
                          fontFamily: 'Arial'
                        }}
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
                        style={{
                          fill: 'white',
                          fontFamily: 'Arial'
                        }}
                      >
                        <Label
                          value={'episode rating'} 
                          angle={-90} 
                          position={'insideLeft'} 
                          offset={10}
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
            {this.state.toggleAppearances ?
              <div className="bottom-table-container-container" 
                   style={{"height": `${window.innerHeight-550}px`}}>
                <div className="bottom-table-container ratings-container"> 
                  <div className="bottom-table-body">
                    {this.renderEpisodes()}
                  </div>
                </div>
              </div>
            :
              <div className="bottom-table-container-container" 
                   style={{"height": `${window.innerHeight-550}px`}}>
                <div className="bottom-table-container appearances-container "> 
                  <div className="bottom-table-body">
                    {this.props.cast.length > 0 && this.renderCast()}
                  </div>
                </div>
              </div>
            }
            <div className="toggle-container">
              <button
                onClick={this.toggleBottom}
                className={this.state.toggleAppearances ? "filled toggle" : "unfilled toggle"}
              >
                Show Ratings
              </button>
              <button
                onClick={this.toggleBottom}
                className={!this.state.toggleAppearances ? "filled toggle" : "unfilled toggle"}
              >
                Show Appearances
              </button>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default SeriesInfo;

