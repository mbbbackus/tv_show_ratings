import React, { Component } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

class SeriesInfo extends Component {
  constructor(props) {
    super(props);
    this.renderEpisodes = this.renderEpisodes.bind(this);
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

  renderEpisodes () {
    if (this.props.info.episodes.length === 0)
      return;
    return this.props.info.episodes.map(episode => (
      <div key={episode.id}>
        <p>{episode.name}</p>
        <p>{episode.average_rating}</p>
        <p>{episode.num_votes}</p>
      </div>
    ));
  }
  render () {
    return (
      <div className="series-info">
        <h1>{this.props.info.primary_title}</h1>
        <div>
          <LineChart width={800} height={400} data={this.props.info.episodes}>
            <Line type="monotone" dataKey="average_rating" stroke="#8884d8" dot={false}/>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" ticks={this.xTicks()} padding={{left:30, right:30}} hide={true}/>
            <YAxis domain={[0,10]} ticks={[0,2,4,6,8,10]}/>
            <Tooltip/>
          </LineChart>
        </div>
        <div>
          {this.renderEpisodes()}
        </div>
      </div>
    );
  }
}

export default SeriesInfo;
